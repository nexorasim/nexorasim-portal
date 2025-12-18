<?php

class NexoraSIM_Auth {
    
    public static function login($request) {
        $email = sanitize_email($request['email']);
        $password = $request['password'];
        
        $user = wp_authenticate($email, $password);
        
        if (is_wp_error($user)) {
            return new WP_Error('login_failed', 'Invalid credentials', array('status' => 401));
        }
        
        $token = self::generate_jwt_token($user->ID);
        
        return array(
            'success' => true,
            'token' => $token,
            'user' => array(
                'id' => $user->ID,
                'email' => $user->user_email,
                'name' => $user->display_name,
                'wallet_balance' => get_user_meta($user->ID, 'wallet_balance', true) ?: 0
            )
        );
    }
    
    public static function register($request) {
        $name = sanitize_text_field($request['name']);
        $email = sanitize_email($request['email']);
        $password = $request['password'];
        $phone = sanitize_text_field($request['phone']);
        
        if (email_exists($email)) {
            return new WP_Error('email_exists', 'Email already exists', array('status' => 400));
        }
        
        $user_id = wp_create_user($email, $password, $email);
        
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        
        wp_update_user(array(
            'ID' => $user_id,
            'display_name' => $name
        ));
        
        update_user_meta($user_id, 'phone', $phone);
        update_user_meta($user_id, 'wallet_balance', 0);
        
        // Send OTP
        $otp = self::generate_otp();
        update_user_meta($user_id, 'otp_code', $otp);
        update_user_meta($user_id, 'otp_expires', time() + 300); // 5 minutes
        
        // In production, send SMS here
        
        return array(
            'success' => true,
            'message' => 'Registration successful. OTP sent to your phone.',
            'user_id' => $user_id
        );
    }
    
    public static function verify_otp($request) {
        $phone = sanitize_text_field($request['phone']);
        $otp = sanitize_text_field($request['otp']);
        
        $users = get_users(array(
            'meta_key' => 'phone',
            'meta_value' => $phone
        ));
        
        if (empty($users)) {
            return new WP_Error('user_not_found', 'User not found', array('status' => 404));
        }
        
        $user = $users[0];
        $stored_otp = get_user_meta($user->ID, 'otp_code', true);
        $otp_expires = get_user_meta($user->ID, 'otp_expires', true);
        
        if ($otp !== $stored_otp || time() > $otp_expires) {
            return new WP_Error('invalid_otp', 'Invalid or expired OTP', array('status' => 400));
        }
        
        // Clear OTP
        delete_user_meta($user->ID, 'otp_code');
        delete_user_meta($user->ID, 'otp_expires');
        
        $token = self::generate_jwt_token($user->ID);
        
        return array(
            'success' => true,
            'token' => $token,
            'user' => array(
                'id' => $user->ID,
                'email' => $user->user_email,
                'name' => $user->display_name,
                'wallet_balance' => get_user_meta($user->ID, 'wallet_balance', true) ?: 0
            )
        );
    }
    
    public static function generate_jwt_token($user_id) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $user_id,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'nexorasim_secret', true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    public static function verify_token($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
        $signature = $parts[2];
        
        $expected_signature = str_replace(['+', '/', '='], ['-', '_', ''], 
            base64_encode(hash_hmac('sha256', $parts[0] . "." . $parts[1], 'nexorasim_secret', true)));
        
        if ($signature !== $expected_signature) return false;
        
        $payload_data = json_decode($payload, true);
        if ($payload_data['exp'] < time()) return false;
        
        return $payload_data['user_id'];
    }
    
    private static function generate_otp() {
        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
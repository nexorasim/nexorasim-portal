<?php

class NexoraSIM_Payment {
    
    public static function get_methods($request) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'nexorasim_payment_methods';
        $methods = $wpdb->get_results("SELECT * FROM $table_name WHERE is_active = 1");
        
        return array(
            'success' => true,
            'data' => $methods
        );
    }
    
    public static function process_payment($data) {
        $amount = floatval($data['amount']);
        $method = sanitize_text_field($data['method']);
        $user_id = intval($data['user_id']);
        
        // Get payment method details
        global $wpdb;
        $table_name = $wpdb->prefix . 'nexorasim_payment_methods';
        $payment_method = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d", $method
        ));
        
        if (!$payment_method) {
            return new WP_Error('invalid_method', 'Invalid payment method', array('status' => 400));
        }
        
        // Process based on payment type
        switch ($payment_method->type) {
            case 'myanmar':
                return self::process_myanmar_payment($payment_method, $amount, $user_id);
            case 'international':
                return self::process_international_payment($payment_method, $amount, $user_id);
            default:
                return new WP_Error('unsupported_method', 'Unsupported payment method', array('status' => 400));
        }
    }
    
    private static function process_myanmar_payment($method, $amount, $user_id) {
        // Myanmar payment gateway integration
        switch ($method->name) {
            case 'WavePay':
                return self::process_wavepay($amount, $user_id);
            case 'AYA Pay':
                return self::process_aya_pay($amount, $user_id);
            case 'KBZ Pay':
                return self::process_kbz_pay($amount, $user_id);
            case 'TransactEase':
                return self::process_transact_ease($amount, $user_id);
            default:
                return new WP_Error('unsupported_myanmar_method', 'Unsupported Myanmar payment method');
        }
    }
    
    private static function process_international_payment($method, $amount, $user_id) {
        // International payment processing (Stripe/PayPal integration)
        $transaction_id = 'TXN_' . time() . '_' . $user_id;
        
        // In production, integrate with actual payment processors
        // For now, simulate successful payment
        
        return array(
            'success' => true,
            'transaction_id' => $transaction_id,
            'amount' => $amount,
            'method' => $method->name
        );
    }
    
    private static function process_wavepay($amount, $user_id) {
        // WavePay API integration
        $api_key = get_option('nexorasim_wavepay_api_key');
        
        $payload = array(
            'amount' => $amount * 100, // Convert to cents
            'currency' => 'MMK',
            'description' => 'NexoraSIM eSIM Purchase',
            'customer_id' => $user_id
        );
        
        $response = wp_remote_post('https://api.wavepay.com/payments', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $api_key,
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode($payload)
        ));
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['status'] === 'success') {
            return array(
                'success' => true,
                'transaction_id' => $body['transaction_id'],
                'amount' => $amount,
                'method' => 'WavePay'
            );
        }
        
        return new WP_Error('payment_failed', 'WavePay payment failed');
    }
    
    private static function process_aya_pay($amount, $user_id) {
        // AYA Pay API integration
        $api_key = get_option('nexorasim_aya_pay_api_key');
        
        // Simulate API call
        $transaction_id = 'AYA_' . time() . '_' . $user_id;
        
        return array(
            'success' => true,
            'transaction_id' => $transaction_id,
            'amount' => $amount,
            'method' => 'AYA Pay'
        );
    }
    
    private static function process_kbz_pay($amount, $user_id) {
        // KBZ Pay API integration
        $api_key = get_option('nexorasim_kbz_pay_api_key');
        
        // Simulate API call
        $transaction_id = 'KBZ_' . time() . '_' . $user_id;
        
        return array(
            'success' => true,
            'transaction_id' => $transaction_id,
            'amount' => $amount,
            'method' => 'KBZ Pay'
        );
    }
    
    private static function process_transact_ease($amount, $user_id) {
        // TransactEase API integration
        $api_key = get_option('nexorasim_transact_ease_api_key');
        
        // Simulate API call
        $transaction_id = 'TE_' . time() . '_' . $user_id;
        
        return array(
            'success' => true,
            'transaction_id' => $transaction_id,
            'amount' => $amount,
            'method' => 'TransactEase'
        );
    }
    
    public static function add_funds($request) {
        $user_id = NexoraSIM_Auth::verify_token($request->get_header('authorization'));
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
        }
        
        $amount = floatval($request['amount']);
        $method = sanitize_text_field($request['method']);
        
        $payment_result = self::process_payment(array(
            'amount' => $amount,
            'method' => $method,
            'user_id' => $user_id
        ));
        
        if (is_wp_error($payment_result)) {
            return $payment_result;
        }
        
        // Add funds to wallet
        $current_balance = get_user_meta($user_id, 'wallet_balance', true) ?: 0;
        $new_balance = $current_balance + $amount;
        update_user_meta($user_id, 'wallet_balance', $new_balance);
        
        return array(
            'success' => true,
            'new_balance' => $new_balance,
            'transaction_id' => $payment_result['transaction_id']
        );
    }
}
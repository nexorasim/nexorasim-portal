<?php

class NexoraSIM_ESIM {
    
    public static function get_plans($request) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'nexorasim_plans';
        $plans = $wpdb->get_results("SELECT * FROM $table_name WHERE is_active = 1");
        
        return array(
            'success' => true,
            'data' => $plans
        );
    }
    
    public static function purchase_plan($request) {
        global $wpdb;
        
        $user_id = NexoraSIM_Auth::verify_token($request->get_header('authorization'));
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
        }
        
        $plan_id = intval($request['plan_id']);
        $payment_method = sanitize_text_field($request['payment_method']);
        
        // Get plan details
        $table_plans = $wpdb->prefix . 'nexorasim_plans';
        $plan = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_plans WHERE id = %d", $plan_id));
        
        if (!$plan) {
            return new WP_Error('plan_not_found', 'Plan not found', array('status' => 404));
        }
        
        // Process payment
        $payment_result = NexoraSIM_Payment::process_payment(array(
            'amount' => $plan->price,
            'method' => $payment_method,
            'user_id' => $user_id
        ));
        
        if (is_wp_error($payment_result)) {
            return $payment_result;
        }
        
        // Generate QR code and activation code
        $activation_code = self::generate_activation_code();
        $qr_data = json_encode(array(
            'type' => 'esim_activation',
            'code' => $activation_code,
            'plan' => $plan->name,
            'country' => $plan->country
        ));
        
        // Create order
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        $order_id = $wpdb->insert($table_orders, array(
            'user_id' => $user_id,
            'plan_id' => $plan_id,
            'status' => 'completed',
            'qr_code' => $qr_data,
            'activation_code' => $activation_code,
            'amount' => $plan->price,
            'payment_method' => $payment_method,
            'payment_id' => $payment_result['transaction_id']
        ));
        
        if (!$order_id) {
            return new WP_Error('order_failed', 'Failed to create order', array('status' => 500));
        }
        
        // Send email receipt
        self::send_email_receipt($user_id, $plan, $activation_code);
        
        return array(
            'success' => true,
            'order_id' => $wpdb->insert_id,
            'qr_code' => $qr_data,
            'activation_code' => $activation_code,
            'message' => 'eSIM purchased successfully'
        );
    }
    
    public static function get_orders($request) {
        global $wpdb;
        
        $user_id = NexoraSIM_Auth::verify_token($request->get_header('authorization'));
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
        }
        
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        $orders = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_orders WHERE user_id = %d ORDER BY created_at DESC", 
            $user_id
        ));
        
        return array(
            'success' => true,
            'data' => $orders
        );
    }
    
    public static function activate_esim($request) {
        global $wpdb;
        
        $user_id = NexoraSIM_Auth::verify_token($request->get_header('authorization'));
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', array('status' => 401));
        }
        
        $order_id = intval($request['order_id']);
        
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        $order = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_orders WHERE id = %d AND user_id = %d", 
            $order_id, $user_id
        ));
        
        if (!$order) {
            return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
        }
        
        // Update activation timestamp
        $wpdb->update(
            $table_orders,
            array('activated_at' => current_time('mysql')),
            array('id' => $order_id)
        );
        
        return array(
            'success' => true,
            'message' => 'eSIM activated successfully'
        );
    }
    
    private static function generate_activation_code() {
        return 'ESIM-' . strtoupper(wp_generate_password(12, false));
    }
    
    private static function send_email_receipt($user_id, $plan, $activation_code) {
        $user = get_user_by('ID', $user_id);
        
        $subject = 'Your NexoraSIM eSIM Purchase Receipt';
        $message = "
        <h2>Thank you for your purchase!</h2>
        <p>Your eSIM for {$plan->country} has been successfully purchased.</p>
        <p><strong>Plan:</strong> {$plan->name}</p>
        <p><strong>Data:</strong> {$plan->data_amount}</p>
        <p><strong>Validity:</strong> {$plan->validity_days} days</p>
        <p><strong>Activation Code:</strong> {$activation_code}</p>
        <p>Use the QR code in the app to activate your eSIM.</p>
        ";
        
        wp_mail($user->user_email, $subject, $message, array('Content-Type: text/html; charset=UTF-8'));
    }
}
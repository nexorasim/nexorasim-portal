<?php

class NexoraSIM_ML_Fraud {
    
    public static function analyze_transaction($transaction_data) {
        $features = self::extract_features($transaction_data);
        $risk_score = self::calculate_risk_score($features);
        
        // Log for ML training
        self::log_transaction($transaction_data, $risk_score);
        
        return array(
            'risk_score' => $risk_score,
            'is_fraud' => $risk_score > 0.7,
            'confidence' => min(1.0, $risk_score * 1.2)
        );
    }
    
    private static function extract_features($data) {
        global $wpdb;
        
        $user_id = $data['user_id'];
        $amount = $data['amount'];
        
        // User history features
        $user_orders = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}nexorasim_orders WHERE user_id = %d", $user_id
        ));
        
        $avg_amount = 0;
        $order_count = count($user_orders);
        if ($order_count > 0) {
            $avg_amount = array_sum(array_column($user_orders, 'amount')) / $order_count;
        }
        
        // Time-based features
        $hour = date('H');
        $is_weekend = date('N') >= 6;
        
        // Recent activity
        $recent_orders = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}nexorasim_orders 
             WHERE user_id = %d AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)", 
            $user_id
        ));
        
        return array(
            'amount_ratio' => $avg_amount > 0 ? $amount / $avg_amount : 1,
            'order_count' => $order_count,
            'hour_of_day' => $hour,
            'is_weekend' => $is_weekend ? 1 : 0,
            'recent_orders' => $recent_orders,
            'amount' => $amount
        );
    }
    
    private static function calculate_risk_score($features) {
        // Simple rule-based scoring (replace with ML model in production)
        $score = 0;
        
        // Amount anomaly
        if ($features['amount_ratio'] > 3) $score += 0.3;
        if ($features['amount'] > 1000) $score += 0.2;
        
        // Velocity check
        if ($features['recent_orders'] > 3) $score += 0.4;
        
        // Time-based risk
        if ($features['hour_of_day'] < 6 || $features['hour_of_day'] > 23) $score += 0.1;
        
        // New user risk
        if ($features['order_count'] == 0) $score += 0.2;
        
        return min(1.0, $score);
    }
    
    private static function log_transaction($data, $risk_score) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'nexorasim_fraud_logs';
        
        $wpdb->insert($table_name, array(
            'user_id' => $data['user_id'],
            'amount' => $data['amount'],
            'payment_method' => $data['payment_method'],
            'risk_score' => $risk_score,
            'features' => json_encode(self::extract_features($data)),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'timestamp' => current_time('mysql')
        ));
    }
    
    public static function train_model() {
        // Placeholder for ML model training
        // In production, this would:
        // 1. Fetch labeled training data
        // 2. Train ML model (scikit-learn, TensorFlow, etc.)
        // 3. Save model for inference
        
        return array(
            'success' => true,
            'message' => 'Model training scheduled'
        );
    }
}
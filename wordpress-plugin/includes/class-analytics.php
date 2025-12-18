<?php

class NexoraSIM_Analytics {
    
    public static function track_event($event_type, $data = array()) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'nexorasim_analytics';
        
        $wpdb->insert($table_name, array(
            'event_type' => sanitize_text_field($event_type),
            'user_id' => get_current_user_id(),
            'data' => json_encode($data),
            'ip_address' => self::get_client_ip(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'timestamp' => current_time('mysql')
        ));
        
        // Send to Firebase for real-time analytics
        self::send_to_firebase($event_type, $data);
    }
    
    public static function get_dashboard_metrics($request) {
        global $wpdb;
        
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        $table_analytics = $wpdb->prefix . 'nexorasim_analytics';
        
        // Active users (last 24 hours)
        $active_users = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(DISTINCT user_id) FROM $table_analytics 
             WHERE timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)"
        ));
        
        // Today's revenue
        $today_revenue = $wpdb->get_var($wpdb->prepare(
            "SELECT SUM(amount) FROM $table_orders 
             WHERE DATE(created_at) = CURDATE() AND status = 'completed'"
        ));
        
        // Orders today
        $orders_today = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table_orders 
             WHERE DATE(created_at) = CURDATE()"
        ));
        
        // Conversion rate
        $views = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table_analytics 
             WHERE event_type = 'plan_view' AND DATE(timestamp) = CURDATE()"
        ));
        
        $purchases = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table_analytics 
             WHERE event_type = 'plan_purchase' AND DATE(timestamp) = CURDATE()"
        ));
        
        $conversion_rate = $views > 0 ? ($purchases / $views) * 100 : 0;
        
        return array(
            'success' => true,
            'data' => array(
                'active_users' => intval($active_users),
                'today_revenue' => floatval($today_revenue),
                'orders_today' => intval($orders_today),
                'conversion_rate' => round($conversion_rate, 2)
            )
        );
    }
    
    public static function get_revenue_chart($request) {
        global $wpdb;
        
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        
        $revenue_data = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(created_at) as date, SUM(amount) as revenue 
             FROM $table_orders 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
             AND status = 'completed'
             GROUP BY DATE(created_at) 
             ORDER BY date"
        ));
        
        $labels = array();
        $data = array();
        
        foreach ($revenue_data as $row) {
            $labels[] = date('M j', strtotime($row->date));
            $data[] = floatval($row->revenue);
        }
        
        return array(
            'success' => true,
            'data' => array(
                'labels' => $labels,
                'datasets' => array(
                    array('data' => $data)
                )
            )
        );
    }
    
    private static function get_client_ip() {
        $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');
        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, 
                        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'];
    }
    
    private static function send_to_firebase($event_type, $data) {
        // Firebase Analytics integration
        $firebase_url = 'https://nexorasim-default-rtdb.firebaseio.com/analytics.json';
        
        $payload = array(
            'event_type' => $event_type,
            'data' => $data,
            'timestamp' => time(),
            'user_id' => get_current_user_id()
        );
        
        wp_remote_post($firebase_url, array(
            'body' => json_encode($payload),
            'headers' => array('Content-Type' => 'application/json')
        ));
    }
}
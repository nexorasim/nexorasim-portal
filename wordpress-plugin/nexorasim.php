<?php
/**
 * Plugin Name: NexoraSIM eSIM Management
 * Description: Complete eSIM management system with WooCommerce integration
 * Version: 1.0.0
 * Author: NexoraSIM Team
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NEXORASIM_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NEXORASIM_PLUGIN_PATH', plugin_dir_path(__FILE__));

class NexoraSIM {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_api_routes'));
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    public function init() {
        $this->load_dependencies();
        $this->create_tables();
    }
    
    public function load_dependencies() {
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-auth.php';
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-esim.php';
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-payment.php';
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-admin.php';
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-analytics.php';
        require_once NEXORASIM_PLUGIN_PATH . 'includes/class-ml-fraud.php';
    }
    
    public function register_api_routes() {
        register_rest_route('nexorasim/v1', '/auth/login', array(
            'methods' => 'POST',
            'callback' => array('NexoraSIM_Auth', 'login'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nexorasim/v1', '/auth/register', array(
            'methods' => 'POST',
            'callback' => array('NexoraSIM_Auth', 'register'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nexorasim/v1', '/auth/verify-otp', array(
            'methods' => 'POST',
            'callback' => array('NexoraSIM_Auth', 'verify_otp'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nexorasim/v1', '/esim/plans', array(
            'methods' => 'GET',
            'callback' => array('NexoraSIM_ESIM', 'get_plans'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nexorasim/v1', '/esim/purchase', array(
            'methods' => 'POST',
            'callback' => array('NexoraSIM_ESIM', 'purchase_plan'),
            'permission_callback' => array($this, 'check_auth')
        ));
        
        register_rest_route('nexorasim/v1', '/payment/methods', array(
            'methods' => 'GET',
            'callback' => array('NexoraSIM_Payment', 'get_methods'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('nexorasim/v1', '/payment/process', array(
            'methods' => 'POST',
            'callback' => array('NexoraSIM_Payment', 'process_payment'),
            'permission_callback' => array($this, 'check_auth')
        ));
        
        register_rest_route('nexorasim/v1', '/analytics/dashboard', array(
            'methods' => 'GET',
            'callback' => array('NexoraSIM_Analytics', 'get_dashboard_metrics'),
            'permission_callback' => array($this, 'check_auth')
        ));
        
        register_rest_route('nexorasim/v1', '/analytics/revenue-chart', array(
            'methods' => 'GET',
            'callback' => array('NexoraSIM_Analytics', 'get_revenue_chart'),
            'permission_callback' => array($this, 'check_auth')
        ));
    }
    
    public function check_auth($request) {
        $token = $request->get_header('authorization');
        if (!$token) return false;
        
        $token = str_replace('Bearer ', '', $token);
        return NexoraSIM_Auth::verify_token($token);
    }
    
    public function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // eSIM Plans table
        $table_name = $wpdb->prefix . 'nexorasim_plans';
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            country varchar(100) NOT NULL,
            country_code varchar(5) NOT NULL,
            data_amount varchar(50) NOT NULL,
            validity_days int NOT NULL,
            price decimal(10,2) NOT NULL,
            currency varchar(5) DEFAULT 'USD',
            description text,
            features text,
            is_active boolean DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // eSIM Orders table
        $table_orders = $wpdb->prefix . 'nexorasim_orders';
        $sql_orders = "CREATE TABLE $table_orders (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            plan_id mediumint(9) NOT NULL,
            status varchar(20) DEFAULT 'pending',
            qr_code text,
            activation_code varchar(100),
            amount decimal(10,2) NOT NULL,
            currency varchar(5) DEFAULT 'USD',
            payment_method varchar(50),
            payment_id varchar(100),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            activated_at datetime NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Payment Methods table
        $table_payments = $wpdb->prefix . 'nexorasim_payment_methods';
        $sql_payments = "CREATE TABLE $table_payments (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            type varchar(20) NOT NULL,
            icon varchar(100),
            api_key varchar(255),
            is_active boolean DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        dbDelta($sql_orders);
        dbDelta($sql_payments);
    }
    
    public function activate() {
        $this->create_tables();
        $this->insert_default_data();
    }
    
    private function insert_default_data() {
        global $wpdb;
        
        // Insert default payment methods
        $payment_methods = array(
            array('WavePay', 'myanmar', 'wave-pay'),
            array('AYA Pay', 'myanmar', 'aya-pay'),
            array('KBZ Pay', 'myanmar', 'kbz-pay'),
            array('TransactEase', 'myanmar', 'transact-ease'),
            array('Visa', 'international', 'visa'),
            array('Mastercard', 'international', 'mastercard')
        );
        
        $table_name = $wpdb->prefix . 'nexorasim_payment_methods';
        foreach ($payment_methods as $method) {
            $wpdb->insert($table_name, array(
                'name' => $method[0],
                'type' => $method[1],
                'icon' => $method[2]
            ));
        }
        
        // Insert sample eSIM plans
        $plans = array(
            array('Thailand 5GB', 'Thailand', 'TH', '5GB', 7, 15.00),
            array('Singapore 3GB', 'Singapore', 'SG', '3GB', 5, 20.00),
            array('Malaysia 10GB', 'Malaysia', 'MY', '10GB', 14, 25.00),
            array('Vietnam 2GB', 'Vietnam', 'VN', '2GB', 3, 12.00)
        );
        
        $table_plans = $wpdb->prefix . 'nexorasim_plans';
        foreach ($plans as $plan) {
            $wpdb->insert($table_plans, array(
                'name' => $plan[0],
                'country' => $plan[1],
                'country_code' => $plan[2],
                'data_amount' => $plan[3],
                'validity_days' => $plan[4],
                'price' => $plan[5]
            ));
        }
    }
}

new NexoraSIM();
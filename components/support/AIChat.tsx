import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your NexoraSIM AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const aiResponse = await getAIResponse(inputText);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('esim') || lowerMessage.includes('plan')) {
      return 'I can help you with eSIM plans! We offer plans for Thailand, Singapore, Malaysia, and Vietnam. Would you like to see available plans for a specific country?';
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'We support multiple payment methods including WavePay, AYA Pay, KBZ Pay, TransactEase, and international cards. Which payment method would you like to use?';
    }
    
    if (lowerMessage.includes('activate') || lowerMessage.includes('qr')) {
      return 'To activate your eSIM: 1) Go to Settings > Cellular/Mobile Data, 2) Tap "Add Cellular Plan", 3) Scan the QR code from your order. Need help finding your QR code?';
    }
    
    if (lowerMessage.includes('refund') || lowerMessage.includes('cancel')) {
      return 'I can help you with refunds. Please provide your order ID and I\'ll check the refund eligibility. Refunds are typically processed within 3-5 business days.';
    }
    
    return 'I understand you need help. Let me connect you with a human agent who can better assist you. Please hold on...';
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      {!item.isUser && <Avatar.Icon size={32} icon="robot" style={styles.avatar} />}
      <Card style={[styles.messageCard, item.isUser ? styles.userCard : styles.aiCard]}>
        <Card.Content style={styles.messageContent}>
          <Text style={item.isUser ? styles.userText : styles.aiText}>{item.text}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text>AI is typing...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          style={styles.textInput}
          mode="outlined"
          multiline
        />
        <Button mode="contained" onPress={sendMessage} style={styles.sendButton}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesList: { flex: 1, padding: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userMessage: { justifyContent: 'flex-end' },
  aiMessage: { justifyContent: 'flex-start' },
  avatar: { marginRight: 8 },
  messageCard: { maxWidth: '80%' },
  userCard: { backgroundColor: '#2196F3' },
  aiCard: { backgroundColor: 'white' },
  messageContent: { padding: 8 },
  userText: { color: 'white' },
  aiText: { color: 'black' },
  typingIndicator: { padding: 16, alignItems: 'center' },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: 'white' },
  textInput: { flex: 1, marginRight: 8 },
  sendButton: { alignSelf: 'flex-end' }
});
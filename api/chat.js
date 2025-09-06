import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GHL API functions - simplified versions of MCP server functions
const ghlFunctions = {
  name: 'ghl_operations',
  description: 'GoHighLevel CRM operations',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['get_contact', 'get_contacts', 'create_contact', 'update_contact', 'get_opportunities', 'send_message', 'get_conversations']
      },
      contactId: { type: 'string' },
      locationId: { type: 'string' },
      data: { type: 'object' }
    },
    required: ['action', 'locationId']
  }
};

async function callGHLAPI(action, locationId, data = {}) {
  const baseURL = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  try {
    switch (action) {
      case 'get_contacts':
        return await axios.get(`${baseURL}/contacts`, {
          headers,
          params: { locationId, limit: 20 }
        });
      
      case 'get_contact':
        return await axios.get(`${baseURL}/contacts/${data.contactId}`, { headers });
      
      case 'create_contact':
        return await axios.post(`${baseURL}/contacts`, {
          ...data,
          locationId
        }, { headers });
      
      case 'get_opportunities':
        return await axios.get(`${baseURL}/opportunities/search`, {
          headers,
          params: { location_id: locationId, limit: 20 }
        });
      
      case 'get_conversations':
        return await axios.get(`${baseURL}/conversations/search`, {
          headers,
          params: { locationId, limit: 20 }
        });
      
      case 'send_message':
        return await axios.post(`${baseURL}/conversations/messages`, data, { headers });
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('GHL API Error:', error.response?.data || error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, locationId, userId, contactId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API keys are configured
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        response: "⚠️ Setup needed: Please add your GEMINI_API_KEY to Vercel environment variables.\n\n1. Go to Vercel Dashboard → Settings → Environment Variables\n2. Add GEMINI_API_KEY with your Google AI Studio key\n3. Redeploy the application" 
      });
    }

    // Initialize Gemini without GHL functions for now
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'
    });

    const contextMessage = `You are a helpful AI assistant for GoHighLevel users. 
    ${locationId ? `User is in GHL location: ${locationId}` : ''}
    ${contactId ? `Currently viewing contact: ${contactId}` : ''}
    ${userId ? `User ID: ${userId}` : ''}
    
    Note: Full GHL integration requires OAuth setup. For now, provide helpful general advice about GoHighLevel.
    
    User message: ${message}`;

    const result = await model.generateContent(contextMessage);
    const response = result.response;

    return res.json({ response: response.text() });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(200).json({ 
      response: `Sorry, I encountered an error: ${error.message}. This is likely due to missing GEMINI_API_KEY environment variable. Please add it in Vercel settings.`
    });
  }
}
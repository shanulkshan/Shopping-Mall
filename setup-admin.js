/**
 * Admin Setup Script
 * Run this script to create an admin user
 * Usage: node setup-admin.js
 */

const readline = require('readline');
const https = require('https');
const http = require('http');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function createAdmin() {
    console.log('🔧 Admin Setup Script');
    console.log('This script will create an admin user for your application.\n');

    try {
        const username = await askQuestion('Enter admin username: ');
        const email = await askQuestion('Enter admin email: ');
        const password = await askQuestion('Enter admin password: ');
        
        if (!username || !email || !password) {
            console.error('❌ All fields are required!');
            process.exit(1);
        }

        const data = JSON.stringify({
            username,
            email,
            password
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/create-admin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let response = '';

            res.on('data', (chunk) => {
                response += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(response);
                    
                    if (res.statusCode === 201) {
                        console.log('✅ Admin user created successfully!');
                        console.log(`📧 Email: ${result.user.email}`);
                        console.log(`👤 Username: ${result.user.username}`);
                        console.log(`🔑 Role: ${result.user.role}`);
                        console.log('\n🎉 You can now login with these credentials!');
                    } else {
                        console.error('❌ Error creating admin:', result.message);
                    }
                } catch (error) {
                    console.error('❌ Error parsing response:', error.message);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error making request:', error.message);
            console.log('💡 Make sure your server is running on port 5000');
        });

        req.write(data);
        req.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

createAdmin();

export const alertEmail = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #dc3545;
            color: #fff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 16px;
            color: #333;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            background: #dc3545;
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin-top: 15px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #f1f1f1;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
        }
        .logo {
            width: 100px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            🚨 Emergency Alert 🚨
        </div>
        <div class="content">
            <p><strong>{{name}}</strong> is in danger! Immediate action is required.</p>
            <a href="{{url}}" class="button">Track {{name}}</a>
        </div>
        <div class="footer">
            <p>Stay Alert, Stay Safe.</p>
            <img src="https://i.postimg.cc/Y08pGqy4/logojpg-removebg-preview.png" alt="Web Logo" class="logo">
        </div>
    </div>
</body>
</html>
`
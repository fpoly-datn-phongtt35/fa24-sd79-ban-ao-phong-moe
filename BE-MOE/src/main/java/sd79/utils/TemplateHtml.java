/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.utils;

public class TemplateHtml {
    public static String printInvoice = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice</title>
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #f8fafc, #e8edf3);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        animation: backgroundMove 6s linear infinite;
                    }
            
                    @keyframes backgroundMove {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
            
                    .invoice-container {
                        width: 90%;
                        max-width: 800px;
                        background: #ffffff;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        animation: fadeIn 1s ease-in-out, floatUp 4s infinite ease-in-out;
                    }
            
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
            
                    @keyframes floatUp {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
            
                    .header {
                        background: linear-gradient(90deg, #007bff, #4a90e2);
                        padding: 20px;
                        text-align: center;
                        color: white;
                    }
            
                    .header h1 {
                        font-size: 24px;
                        margin: 0;
                        font-weight: bold;
                        animation: textGlow 2s ease-in-out infinite;
                    }
            
                    .header p {
                        margin: 5px 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }
            
                    @keyframes textGlow {
                        0%, 100% {
                            text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                        }
                        50% {
                            text-shadow: 0 0 20px rgba(255, 255, 255, 1);
                        }
                    }
            
                    .customer-info {
                        padding: 20px;
                        background: #f9fafb;
                        border-bottom: 1px solid #e1e4e8;
                    }
            
                    .customer-info h2 {
                        font-size: 18px;
                        color: #333;
                        margin-bottom: 10px;
                    }
            
                    .customer-info p {
                        font-size: 14px;
                        margin: 5px 0;
                        color: #555;
                    }
            
                    .product-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        background: rgba(250, 250, 250, 0.8);
                        animation: shimmerEffect 4s linear infinite;
                    }
            
                    .product-table thead th {
                        background: #007bff;
                        color: #ffffff;
                        padding: 12px;
                        font-size: 14px;
                        text-align: left;
                    }
            
                    .product-table tbody tr {
                        transition: all 0.3s ease;
                    }
            
                    .product-table tbody tr:hover {
                        background: #f1f5f8;
                    }
            
                    .product-table tbody td {
                        padding: 12px;
                        font-size: 14px;
                        border-bottom: 1px solid #e1e4e8;
                    }
            
                    @keyframes shimmerEffect {
                        0% {
                            background-position: -800px 0;
                        }
                        100% {
                            background-position: 800px 0;
                        }
                    }
            
                    .total-container {
                        padding: 20px;
                        text-align: right;
                    }
            
                    .total-container h3 {
                        font-size: 18px;
                        color: #28a745;
                        margin: 0;
                    }
            
                    .footer {
                        padding: 20px;
                        background: #f9fafb;
                        text-align: center;
                    }
            
                    .footer p {
                        font-size: 14px;
                        color: #666;
                        margin: 0;
                    }
            
                    .shop-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 20px;
                        font-size: 16px;
                        font-weight: bold;
                        color: white;
                        background: linear-gradient(90deg, #ff6a00, #ee0979);
                        border: none;
                        border-radius: 50px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: all 0.3s ease-in-out;
                        box-shadow: 0 4px 15px rgba(238, 9, 121, 0.4);
                        animation: pulseEffect 2s infinite;
                    }
            
                    .shop-button:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 6px 20px rgba(238, 9, 121, 0.6);
                    }
            
                    .shop-button:active {
                        transform: translateY(0);
                        box-shadow: 0 2px 10px rgba(238, 9, 121, 0.2);
                    }
            
                    @keyframes pulseEffect {
                        0%, 100% {
                            box-shadow: 0 4px 15px rgba(238, 9, 121, 0.4);
                        }
                        50% {
                            box-shadow: 0 4px 25px rgba(238, 9, 121, 0.6);
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <h1>Hóa Đơn Mua Hàng</h1>
                        <p>Cảm ơn quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi!</p>
                    </div>
            
                    <div class="customer-info">
                        <h2>Thông Tin Khách Hàng</h2>
                        <p><strong>Tên:</strong> {{customer_name}}</p>
                        <p><strong>Email:</strong> {{customer_email}}</p>
                        <p><strong>Mã hóa đơn:</strong> {{bill_code}}</p>
                    </div>
            
                    <table class="product-table">
                        <thead>
                            <tr>
                                <th>Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Đơn Giá</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{product_name_1}}</td>
                                <td>{{quantity_1}}</td>
                                <td>{{price_1}} VND</td>
                                <td>{{total_1}} VND</td>
                            </tr>
                            <tr>
                                <td>{{product_name_2}}</td>
                                <td>{{quantity_2}}</td>
                                <td>{{price_2}} VND</td>
                                <td>{{total_2}} VND</td>
                            </tr>
                            <!-- More rows if needed -->
                        </tbody>
                    </table>
            
                    <div class="total-container">
                        <h3>Tổng cộng: {{total_price}} VND</h3>
                    </div>
            
                    <div class="footer">
                        <p>Quý khách có thể tiếp tục mua sắm với các sản phẩm tuyệt vời khác tại cửa hàng của chúng tôi!</p>
                        <a href="http://localhost:1004/my-order" class="shop-button">Quay lại cửa hàng</a>
                    </div>
                </div>
            </body>
            </html>
            
            """;
}

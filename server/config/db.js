const mongoose = require('mongoose');

// 连接MongoDB数据库
const connectDB = async () => {
  try {
    // 在实际项目中，这个URI应该存储在环境变量中
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-demo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB连接错误: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

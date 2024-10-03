import { DataTypes } from 'sequelize';
import sequelize from '../config'; // เปลี่ยน path ให้ตรงกับที่ตั้งไฟล์ configDB.js

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'), // กำหนดค่าเป็น male, female หรือ other
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // ทำให้หมายเลขโทรศัพท์ไม่ซ้ำ
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // ทำให้ชื่อผู้ใช้ไม่ซ้ำ
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // ค่าพื้นฐานเป็นวันที่และเวลาปัจจุบัน
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // ค่าพื้นฐานเป็นวันที่และเวลาปัจจุบัน
  },
}, {
  timestamps: true, // อนุญาตให้ Sequelize จัดการ createdAt และ updatedAt อัตโนมัติ
});


export default User;

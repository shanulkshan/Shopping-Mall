import mongoose from 'mongoose';


const bookShopSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    required: true
  },
  stallNumber: {
    type: Number, 
    required: true
  },
  FloorNumber: {
    type: Number, 
    required: true
  },
 
  Des: {
    type: String,
    required: true
  }
});


const bookShop = mongoose.model('bookShop', bookShopSchema);

export default  bookShop;
import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
 

shopId: {
        type: String,
        required: true
    },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    required: true
  },
  
  desc: {
    type: String,
    required: true
  },
  qrimage: {
    type: String, 
    
  },
  quntity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },



  
});


const product = mongoose.model('product', productSchema);

export default  product;
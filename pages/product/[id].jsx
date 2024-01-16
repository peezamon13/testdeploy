import Image from "next/image";
import { useState } from "react";
import Title from "../../components/ui/Title";
import { addProduct } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";

const Index = ({ food }) => {
  const [prices, setPrices] = useState(food.prices);
  const [price, setPrice] = useState(prices[0]);
  const [size, setSize] = useState(0);
  const [extraItems, setExtraItems] = useState(food?.extraOptions);
  const [extras, setExtras] = useState([]);
  const cart = useSelector((state) => state.cart);

  const findCart = cart.products.find((item) => item._id === food._id);

  const dispatch = useDispatch();

  const handleSize = (sizeIndex) => {
    const difference = prices[sizeIndex] - prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };

  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleChange = (e, item) => {
    const checked = e.target.checked;

    if (checked) {
      changePrice(item.price);
      setExtras([...extras, item]);
    } else {
      changePrice(-item.price);
      setExtras(extras.filter((extra) => extra.id !== item.id));
    }
  };

  const handleClick = () => {
    dispatch(
      addProduct({
        ...food,
        foodQuantity: 1,
        title: food.title,
        img: food.img,
        extras,
        price,
        quantity: 1,
      })
    );
  };
  

  console.log(food);

  return (
    <div className="flex items-center md:h-[calc(100vh_-_88px)] gap-3 py-10 flex-wrap ">
      <div className="relative  md:w-full md:h-[80%] w-full h-60 mx-auto">
        <Image
          src={food?.img}
          alt=""
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      
      <div className="md:flex-1  text-center w-full">
        <Title addClass="text-4xl">{food.title}</Title>
        <span className="text-primary text-2xl font-bold underline underline-offset-1 my-4 inline-block">
          ${price}
        </span>
    
      </div>

        <div className="w-full flex justify-center items-center my-1 gap-x-2 text-center">
          {extraItems.map((item) => (
            <label className="flex items-center gap-x-1" key={item._id}>
              <input
                type="checkbox"
                className="w-5 h-5 accent-primary"
                onChange={(e) => handleChange(e, item)}
              />
              <span className="text-sm font-semibold">{item.text}</span>
            </label>
          ))}
          </div>
        <div className="w-full flex justify-center item-center">
          <input 
          type="text"
          className="border border-gray-300 p-0.5 rounded-md w-[70%]" 
          placeholder="Type something..."/>
        </div>
       <div className="w-full flex justify-center item-center btn-center ">
        <button
          className="btn-primary justify-center item-center"
          onClick={handleClick}
          
          >
          Add to Cart
        </button>
        <Link href="/menu"> 
          <a className="btn-secondary ml-3 fa-solid fa-mail-reply mt-4  "> Back </a> 
        </Link>
        
      </div> 
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`
  );
  return {
    props: {
      food: res.data ? res.data : null,
    },
  };
};

export default Index;

import Image from "next/image";
import Link from "next/link";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const MenuItem = ({ product }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const findCart = cart.products.find((item) => item._id === product._id);

  const addToCart = () => {
    dispatch(
      addProduct({
        ...product,
        extras: [],
        price: product.prices[0],
        quantity: 1,
        foodQuantity: 1,
      })
    );
  };

  return (
  <Link href={`/product/${product._id}`}>
    <div className="bg-secondary rounded-3xl h-[330px] relative">
      <div className="w-full  bg-[#f1f2f3] h-[170px] grid place-content-center rounded-bl-[46px] rounded-tl-2xl rounded-tr-2xl ">
          <div className="relative w-36 h-36 hover:scale-110 transition-all">
            <Image
              src={product.img}
              alt=""
              layout="fill"
              className="rounded-full"
            />
          </div>
      </div>
      <div className="p-[25px] text-white ">
        <h4 className="text-xl font-semibold mb-3 ">{product.title}</h4>
        <p className="text-[15px]">{product.desc}</p>
        <div className="flex justify-between items-center mt-4">
          <span>${product.prices[0]}</span>
       
        </div>
      </div>
    </div>
  </Link>
  );
};

export default MenuItem;

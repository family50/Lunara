import { useLocation } from "react-router-dom";
import AllProducts from "./all-products.jsx";
import OneProduct from "./one-products.jsx";
import MainProduct from "./main-product.jsx";
import { discoverMoreProducts } from "../date/Discover-More";
import Footer from "../home/Footer.jsx"; 
import Products from "../productspage/products.jsx"; // تأكد من صحة المسار هنا

export default function HomeAllProducts({ setPagge }) {
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);

 // استخراج الحالة: جعلنا القيمة الافتراضية "intro" لتعرض صفحة الـ 3D الأولى
  const currentPagge = location.state?.pagge || "intro"; 
  const sectionKey = params.get("section") || location.state?.sectionKey || location.state?.section;
  const productId = params.get("id") || location.state?.productId; 

  const sectionData = sectionKey ? discoverMoreProducts[sectionKey] : null;
  const product = (currentPagge === "one" && sectionData) 
    ? sectionData.products?.find((p) => String(p.id) === String(productId)) 
    : null;
  // 2. جلب بيانات السيكشن


  // 3. جلب المنتج (فقط إذا كنا في صفحة One وكان هناك sectionData)

  // 4. تحديد الألوان "بذكاء" لمنع الـ Crash
  // لو احنا في صفحة One، نستخدم ألوان المنتج، غير كده نستخدم ألوان السيكشن، غير كده أبيض وأسود
  const finalBgColor = (currentPagge === "one" && product) 
    ? product.backgroundProduct 
    : (sectionData?.theme?.light || "#ffffff");

  const finalThumbColor = (currentPagge === "one" && product) 
    ? product.textColorProduct 
    : (sectionData?.theme?.dark || "#000000");

  return (
    <div>
      {/* الحالة الجديدة: صفحة المنتج الـ 3D مع زر Explore */}
      {currentPagge === "intro" && (
        <Products setPagge={setPagge} />
      )}
      {currentPagge === "all" && (
        <>
          <AllProducts setPagge={setPagge} section={sectionKey} />
          <Footer 
            className="all-products-footer11"
            bgColor={finalBgColor} 
            thumbColor={finalThumbColor} 
          /> 
        </>
      )}

      {currentPagge === "one" && (
        <>
          <OneProduct setPagge={setPagge} />
          <Footer 
            className="one-products-footer11"
            bgColor={finalBgColor} 
            thumbColor={finalThumbColor} 
          /> 
        </>
      )}

    {currentPagge === "main" && (
        <>
          <MainProduct setPagge={setPagge} />
   
        </>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import db, { storage } from "../database/firebase";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";
import "../styles/Create.css";
import { Navigate } from "react-router-dom";

export default function Create() {
  const [file, setFile] = useState();
  const [item_name, setItem_name] = useState("");
  const [api_price, setApi_price] = useState("");
  const [price, setPrice] = useState("");
  const [cateType_id, setCateType_id] = useState("");
  const [cateType_name, setCateType_name] = useState("");
  const [item_img, setItem_img] = useState("");
  const [categorys, setCategorys] = useState("");
  const [letgo, setLetgo] = useState(false);
  const [imgUpload, setImgUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const Get = async () => {
    const myDoc = query(collection(db, "cate_type"));
    const querySnapshot = await getDocs(myDoc);
    setCategorys(querySnapshot.docs.map((doc) => ({ ...doc.data() })));
    console.log(categorys);
  };

  const createItem = async () => {
    if (imgUpload == null) return;
    // const imageRef = ref(storage, `/${imgUpload.name + v4()}`);
    const imageRef = ref(storage, `/${imgUpload.name}`);
    await uploadBytes(imageRef, imgUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImgUpload(url);
        setImageUrls((prev) => [...prev, url]);
      });
    });
    const imageupload = await getDownloadURL(imageRef);

    const docRef = addDoc(collection(db, "item"), {
      item_name: item_name,
      api_price: api_price,
      price: price,
      cateType_id: Number(cateType_id),
      cateType_name: cateType_name,
      item_img: { uri: imageupload },
    });
    setLetgo(true);
    console.log("create :", docRef.id);
  };

  const imagesListRef = ref(storage, "/");

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });

    Get();
  }, []);
  // console.log(imageUrls);
  if (letgo) {
    return <Navigate to="/TableList" />;
  }

  return (
    <section className="create-section">
      <div className="create-container">
        <div className="box-title">
          <h3>Create Item</h3>
        </div>
        {/* <form className="create-form"> */}
        <div>
          <input
            className="create-input"
            type="text"
            placeholder="ชื่อไอเทม เช่น ผักกาดขาว"
            name="content"
            onChange={(event) => {
              setItem_name(event.target.value);
            }}
          />
        </div>
        <div>
          <input
            className="create-input"
            type="text"
            placeholder="api price"
            name="author"
            onChange={(event) => {
              setApi_price(event.target.value);
            }}
          />
        </div>
        <div>
          <input
            className="create-input"
            type="text"
            placeholder="ราคา"
            name="author"
            onChange={(event) => {
              setPrice(event.target.value);
            }}
          />
        </div>
        <div className="create-select">
          <select
            className="select"
            onChange={(event) => {
              const category = categorys.find(
                (item) => item.cateType_id == event.target.value
              );
              console.log(category.cateType_name);
              setCateType_name(category.cateType_name);
              setCateType_id(event.target.value);
            }}
          >
            <option>เลือกหมวดหมู่</option>
            <option value="1">1: ผัก</option>
            <option value="2">2: ผลไม้</option>
            <option value="3">3: เนื้อหมู</option>
            <option value="4">4: เนื้อไก่</option>
            <option value="5">5: เป็ด</option>
            <option value="6">6: เนื้อวัว</option>
            <option value="7">7: ไข่</option>
            <option value="8">8: ไส้กรอก</option>
            <option value="9">9: อาหารทะเล</option>
            <option value="10">10: ปลา</option>
            <option value="11">11: เครื่องปรุง</option>
            <option value="12">12: ข้าวสาร&แป้ง</option>
            <option value="13">13: ธัญพืช</option>
            <option value="14">14: น้ำมัน</option>
            <option value="15">15: จิปาถะ</option>
          </select>
        </div>
        {/* <div className="add-img">
          <h3>Add Image:</h3>
          <input
            className="create-input"
            type="text"
            placeholder="url"
            name="author"
            onChange={(event) => {
              setItem_img(event.target.value);
            }}
          />
        </div> */}
        <div className="add-img">
          <input
            type="file"
            onChange={(event) => {
              setImgUpload(event.target.files[0]);
            }}
          />
          {/* <button onClick={uploadFile}>Upload Image</button> */}
          {/* {imageUrls.map((url) => {
            return <img src={url} />;
          })} */}
          {/* {imgUpload && <img src={imgUpload} alt="uploaded image" />} */}
          {/* <div>
            {imgUpload && <img src={imgUpload} alt=" uploaded image" />}
          </div> */}
        </div>

        <button className="button" onClick={createItem}>
          Add
        </button>

        {/* </form> */}
      </div>
    </section>
  );
}

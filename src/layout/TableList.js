import React, { useState, useEffect } from "react";
import '../styles/Table.css'
import TableBootstrap from "react-bootstrap/Table";
import db, { storage } from "../database/firebase";
import { Modal, Button, Card } from 'react-bootstrap';
import { collection, query, updateDoc, deleteDoc, doc, onSnapshot, getDoc,orderBy,limit} from "firebase/firestore";
import Swal from 'sweetalert2'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
  } from "firebase/storage";
import { FaRegTrashAlt,FaRegEdit,FaBitcoin } from "react-icons/fa";
import { async } from "@firebase/util";

export default function TableList() {
    const [test, setTest] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);
    const [item_name, setItem_name] = useState('');
    const [api_price, setApi_price] = useState('');
    const [price, setPrice] = useState('');
    const [cateType_id, setCateType_id] = useState('');
    const [item_img, setItem_img] = useState('');
    const [imgUpload, setImgUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    const Get = async () => {
        const myDoc = query(
            collection(db, "item"),orderBy('cateType_id','asc')
        );
        onSnapshot(myDoc, (snapshot) => setTest(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
        
    };
    console.log(test);
    const Edit = async (id) => {
        const washingtonRef = doc(db, "item", id);
        // console.log(id);

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

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
            item_name: item_name || itemedit.item_name,
            api_price: api_price || itemedit.api_price,
            cateType_id: cateType_id || itemedit.cateType_id,
            price: price || itemedit.price,
            item_img: { uri: imageupload } || itemedit.item_img,
        });
        setShow(false);
    };

    const Del = async (id) => {
        Swal.fire({
            title: 'Do you want to delete?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "item", id));
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })        
    };
    
    const Reset = async (id) => {
        try{
            const day = new Date();
            const yesterday = new Date(day);
            yesterday.setDate(day.getDate() - 1);

            const dateStart = yesterday.toISOString();
            // console.log(dateStart);
            const todayy = new Date().toISOString();
            const today = todayy.split("T")[0];
            console.log('price',id.api_price)

            const res = await fetch(`https://dataapi.moc.go.th/gis-product-prices?product_id=${id.api_price}&from_date=${dateStart}&to_date=${today}`);
         
            const json = await res.json();
            console.log(json)
            if(json.price_min_avg){
                console.log('Price',json.price_min_avg)
                var price_min = await json.price_min_avg
                
                const updateRef = doc(db, "item", id.id);
                await updateDoc(updateRef, {
                    price: price_min || 0
                }).then((docR)=>{
                    console.log('done')
                    // Swal.fire(
                    //     'Update Success!',
                    // )
                }).catch(e=>{
                    console.log(e)
                })
            }else{
                price_min = 0
            }
            test["price"] = price_min
        }
        catch(error){
          console.log('error')
        }
    }

    const [itemedit, setItemedit] = useState([]);
    const [itemeditid, setItemeditid] = useState("");
    const Getitem = async (id) => {
        const myDoc = doc(db, "item", id);
        const querySnapshot = await getDoc(myDoc);
        if (querySnapshot.exists()) {
            const proo = querySnapshot.data();
            setItemedit(proo);
            setItemeditid(querySnapshot.id);
            setShow(true);
        } else {
            console.log("No such document!");
        }
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

    var arry = test.length;
    console.log(arry);

    return (
        <div className="App">
            <div className="container">
                <Card className="card-title">
                    <div className="title">
                        <Card.Body>
                            {arry} Item
                        </Card.Body>
                        <Button 
                            className="reset-btn" 
                            onClick={() => { 
                                test.forEach((doc)=>{
                                    if(doc.id && doc.api_price){
                                        Reset({api_price: doc.api_price, id: doc.id})
                                    }
                                })
                            }} 
                        ><FaBitcoin/> Update</Button>
                    </div>
                
                </Card>

            <TableBootstrap striped bordered hover>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">id</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Category</th>
                        <th scope="col">img</th>
                    </tr>
                </thead>
                {test.map((item, i) => {
                    return (
                        <tbody key={i} 
                        // style={{backgroundColor: '#ffffff'}}
                        >
                            <tr>
                                <th scope="row">{i + 1}</th>
                                <td>{item.api_price}</td>
                                <td>
                                    {item.item_name}
                                </td>
                                <td>{item.price}</td>
                                <td>{item.cateType_id} : {item.cateType_name}</td>
                                <td>
                                    <img
                                        src={item.item_img.uri}
                                        alt="avatar"
                                        style={{ width: "100px" }}
                                    />
                                </td>
                                <div className="box-btn" >
                                    {/* <Button className="reset-btn" onClick={() => { Reset({api_price: item.api_price, id: item.id})}} >Reset Price</Button> */}
                                    <Button className="edite-btn"  onClick={() => { Getitem(item.id); }}><FaRegEdit/> Edit</Button>
                                    <Button className="delete-btn"  onClick={() => { Del(item.id); }}><FaRegTrashAlt/> Delete</Button>
                                    {/* <Button className="delete-btn" onClick={() => { Del(item.id); }}><FaRegTrashAlt/> Delete</Button> */}
                                </div>

                            </tr>
                        </tbody>
                    );
                })}
            </TableBootstrap>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edite Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-title">
                        <h6>Item Name</h6>
                        <input
                            className="input"
                            type="text"
                            placeholder="ชื่อไอเทม เช่น ผักกาดขาว"
                            defaultValue={itemedit.item_name}
                            name="content"
                            onChange={(event) => { setItem_name(event.target.value) }}
                        />
                    </div>
                    <div className="create-title">
                        <h6>API Price ID</h6>
                        <input
                            className="input"
                            type="text"
                            placeholder="API Price"
                            defaultValue={itemedit.api_price}
                            name="author"
                            onChange={(event) => { setApi_price(event.target.value) }}
                        />
                    </div>
                    <div className="create-title">
                        <h6>Price</h6>
                        <input
                            className="input"
                            type="text"
                            placeholder="Price"
                            defaultValue={itemedit.price}
                            name="author"
                            onChange={(event) => { setPrice(event.target.value) }}
                        />
                    </div>
                    <div className="create-title">
                        <h6>Category</h6>
                        <select className="select" onChange={(event) => { setCateType_id(event.target.value) }}>
                            <option>{itemedit.cateType_id} : {itemedit.cateType_name}</option>
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
                    {/* <div className="create-title">
                        <h6>Add Image</h6>
                        <input
                            className="input"
                            type="text"
                            placeholder="uri"
                            defaultValue={itemedit.item_img?.uri}
                            name="author"
                            onChange={(event) => { setItem_img(event.target.value) }}
                        />
                    </div> */}
                    <div className="create-title">
                        <h6>Add Image</h6>
                        <input
                            type="file"
                            onChange={(event) => {
                                setImgUpload(event.target.files[0]);
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        Edit(itemeditid);
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    );
}
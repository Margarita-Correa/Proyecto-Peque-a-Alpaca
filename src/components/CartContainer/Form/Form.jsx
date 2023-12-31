import { useState } from "react"
import { useCartContext } from "../../../context/CartContext"
import { addDoc, collection, getFirestore } from "firebase/firestore"
import './Form.css'

export const Form =()=>{
    const {cartList, totalPrice, emptyCart} = useCartContext()
    const [isId, setIsId] = useState('')
    const [formData, setFormData] = useState({
        name:'',
        phone:'',
        email:'',
        repeatEmail:''
    })

    const handleOrder = async (evt) =>{
        evt.preventDefault()
        const order = {}
        order.buyer = formData
        order.items = cartList.map(({id, title, price})=> ({ id, title, price}))
        order.total = totalPrice()

        const db = getFirestore()
        const orderCollection = collection(db, 'orders')

        addDoc(orderCollection, order)
        .then(res => setIsId(res.id))
        .catch(err => console.log(err))
        .finally(()=> {
        setFormData({
            name:'',
            phone:'',
            email:'',
            repeatEmail:''
        })
        })
    }

    const handleOnChange = (evt)  =>{
       setFormData({
        ...formData,
        [evt.target.name]: evt.target.value
       }) 
    }
    
        return(
            <>
                <div className="text-center ">
                {isId !== '' && <label>La orden de compra <strong>{isId}</strong> se ha generado exitosamente.</label>}
                </div>            
                <form onSubmit={handleOrder}>
                <label>Para terminar la compra complete con sus datos: </label><br />
                <label>Nombre Completo: </label><br />
                <input 
                    type="text"
                    name="name"
                    value= {formData.name}
                    onChange={handleOnChange}
                />
                <br /><label>Numero de telefono: </label><br />
                <input 
                    type="text"
                    name="phone"
                    value= {formData.phone}
                    onChange={handleOnChange}
                />
                <br /><label>Email: </label><br />
                <input 
                    type="text"
                    name="email"
                    value= {formData.email}
                    onChange={handleOnChange}
                />
                <br /><label>Confirme su email: </label><br />
                <input 
                    type="text"
                    name="repeatEmail"
                    value={formData.repeatEmail}
                    onChange={handleOnChange}
                />
                <br /><button className="btn btn-success m-2">Comprar</button>
            </form>
        </>
    )}


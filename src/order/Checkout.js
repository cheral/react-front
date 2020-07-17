import React , { useState, useEffect } from "react";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import {getRazorpayOrderId, pay_razor, loadScript, razorpay_verify} from "./apiPayments";
import {emptyCart} from "./cartHelpers";
import {createOrder} from "./apiOrders";

const Checkout = ({products}) => {

	const [data, setData] = useState({
        loading: false,
        success: false,
        merchant_order_id: null,
        amount: null,
        currency: null,
        error: '',
        address: ''
    });

	const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
	const user = isAuthenticated() && isAuthenticated().user;
	let deliveryAddress = data.address

    const getToken = (userId, token) => {
    	return new Promise((resolve, reject) => {
        getRazorpayOrderId(userId, token).then(res => {
            if (res.error) {
                console.log(res.error);
                setData({ ...data, error: res.error });
                reject(Error("Failed to load script"));
            } else {
            	// set state with amount currency and merchant order id for all merchants
                resolve(res);
            }

        }).catch(err => console.log(err));
    })
    };

    const handleAddress = event => {
    	setData({...data, address: event.target.value})
    }

	const getTotal = () => {
    	return products.reduce((currentValue, nextValue) => {
	    	return currentValue + nextValue.count * nextValue.price;
	    }, 0);
	};

	const showSuccess = success => {
        return    <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    };

    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );


	const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;
	

	const buy = () => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
        .then(res => {
		    getToken(userId, token)
		    .then(res => {
		       	// pay razor to be replaced with a generic processPayment func that would call pay_razor
		        pay_razor(user, userId, res.amount, res.currency, res.id, token)
	            .then(res => {
	  	            //const data = {
				    //order_id .log(: res.id
		            // merchant_name / id: paypal / razorpay
				    //}
                    // razorpay verify to be replaced with a generic verification function that would call razorpay verify
		    	    razorpay_verify(userId, res, token)
		    	    .then(order_details => {  // order details is a json with payment_status: true
		    	    	// the generic verification function should return true / false  json ; this would help me integrate it ith the order db
				        console.log(order_details); 

				        const createOrderData = {
							products: products,
							transaction_id: order_details.transaction_id,
							amount: order_details.amount,
							address: data.address
				        	// payment_id
				        	//order_id
				        	//amount
							// address: data.add
				
						}
						console.log(createOrderData);
						createOrder(userId, token, createOrderData);
				        setData({...data, success: order_details.payment_status});
				        emptyCart(() => {
				        	console.log("emptying cart");
						});
						
				        //empty cart 
				        // create order
			        })
    				.catch(err => console.log(err));
    			})
		        .catch(err => console.log(err));
	   	    })
	        .catch(err => console.log(err));
        })
       .catch(err => console.log(err));
	};

	const showPay = () => (
		<div>
		{products.length > 0 ?  (
			//<RazorpayComponent/>
			<div>
			<div className="form-group mb-3">
                <label className="text-muted">Delivery address:</label>
                <textarea
                    onChange={handleAddress}
                    className="form-control"
                    value={deliveryAddress}
                    placeholder="Type your delivery address here."
                />
			</div>
		    <button onClick={buy} className="btn btn-success">Pay</button>
		    </div>
			) : null}
		</div>
	);

	const showCheckout = () => {
		return isAuthenticated() ? (
            <div>{showPay()}</div>
		   	) : (
		   	<Link to="/signin">
		   	<button className="btn btn-primary"> Sign in to Checkout </button>
		   	</Link>
	    ) 
	};


	return (
		<div>
		    <h2>Total: INR {getTotal()}</h2>
		    {showSuccess(data.success)}
		    {showSuccess(data.error)}
		    {showCheckout()}
		</div>
	);
};

export default Checkout;
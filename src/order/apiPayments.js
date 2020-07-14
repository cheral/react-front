import React, { useState} from "react";


export const loadScript = (src) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			resolve(true);
		}
		script.onerror = () => {
			reject(Error("Failed to load script"));
		}
		document.body.appendChild(script);
	})
};


export const getRazorpayOrderId = (userId, token) => {
   return fetch(`${process.env.REACT_APP_API_URL}/razorpay/getOrderId/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const razorpay_verify = (userId, data, token) => {
   return fetch(`${process.env.REACT_APP_API_URL}/check_success/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}; 

export const pay_razor = (user, userId, amount, currency, order_id, token) => {
	return new Promise((resolve, reject) => {
		const options = {
			key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
			currency: currency,
			order_id: order_id,
			amount: amount.toString(),
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				const data = {
				paymentId : response.razorpay_payment_id,
				order_id : response.razorpay_order_id,
				signature : response.razorpay_signature
                }
                // if paymentId is undefined - reject with error message or resolve to false and show payment failed
                resolve(data);
			},
			prefill: {
				name: user.name,
				email: user.email,
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	});
};
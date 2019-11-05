Used to generate the body for a bulk `HTTP PATCH` request.

Let's say we have this original object.
```javascript
let oldDocument = {
   documentHeader : {
     id: 123,
     key: "2019/00001",
     client: 42,
     dueDate: "2019-12-25"
   }, 
   documentItems : [
     { id: 2001, sku: "A12345", quantity: 10, price: 300 },
     { id: 2002, sku: "B54321", quantity: 6, price: 500 }, 
     { id: 2003, sku: "C11223", quantity: 20, price: 200 },
   ]
}
```

And the user makes some modifications to it...
```javascript
let updatedDocument = {
   documentHeader : {
     id: 123,
     key: "2019/00001",
     client: 42,
     dueDate: "2019-12-30" // Changes the date
   }, 
   documentItems : [
     { id: 2001, sku: "A12345", quantity: 10, price: 150 }, // Changes the price
     // { id: 2002, sku: "B54321", quantity: 10, price: 500 }, // Deletes this one
     { id: 2003, sku: "C11223", quantity: 20, price: 200 },
     { id: 2004, sku: "D9999", quantity: 1, price: 7000 }, // Adds this item
   ]
}
```
When we apply the patch generation function, we should get the following...
```javascript
generatePatch(oldDocument, updatedDocument)

{
    // Maybe include the document ID here as a property?
    updateHeader: {
        client: 42,
        dueDate: "2019-12-30",
        id: 123,
        key: "2019/00001"
    },
    createItems: [
        {
            id: 2004,
            price: 7000,
            quantity: 1,
            sku: "D9999"
        }
    ],
    deleteItems: [
        {
            id: 2002,
            price: 500,
            quantity: 6,
            sku: "B54321"
        }
    ],
    updateItems: [
        {
            id: 2001,
            price: 150,
            quantity: 10,
            sku: "A12345"
        }
    ]
}
```
let oldDocument = {
    documentHeader: {
        id: 123,
        key: "2019/00001",
        client: 42,
        dueDate: "2019-12-25"
    },
    documentItems: [
        { id: 2001, sku: "A12345", quantity: 10, price: 300 },
        { id: 2002, sku: "B54321", quantity: 6, price: 500 },
        { id: 2003, sku: "C11223", quantity: 20, price: 200 },
        { id: 2005, sku: "F66666", quantity: 33, price: 33 },
    ]
}

let updatedDocument = {
    documentHeader: {
        id: 123,
        key: "2019/00001",
        client: 42,
        dueDate: "2019-12-30"     // Changes the date
    },
    documentItems: [
        { id: 2001, sku: "A12345", quantity: 10, price: 150 },   // Changes the price
        // { id: 2002, sku: "B54321", quantity: 10, price: 500 },   // Deletes this one
        { id: 2003, sku: "C11223", quantity: 20, price: 200 },
        { id: 2004, sku: "D9999", quantity: 1, price: 7000 },  // Adds this item
        { id: 2005, sku: "F66666", quantity: 33, price: 6000 },
    ]
}

function generatePatch(oldDocument, updatedDocument) {
    let patch = {}

    // This is done like this to prevent sending empty arrays
    let isSameHeader = isSameObject(oldDocument.documentHeader, updatedDocument.documentHeader);
    if (!isSameHeader) patch.updateHeader = updatedDocument.documentHeader

    let deleteItems = diffArray(oldDocument.documentItems, updatedDocument.documentItems)
    if (deleteItems.length > 0) patch.deleteItems = deleteItems

    let createItems = diffArray(updatedDocument.documentItems, oldDocument.documentItems)
    if (createItems.length > 0) patch.createItems = createItems

    let updateItems = findModifiedObjectsInArray(oldDocument.documentItems, updatedDocument.documentItems);
    if (updateItems.length > 0) patch.updateItems = updateItems

    // Find new/missing items in array2
    function diffArray(array1, array2) {
        // Return all item2s
        return array1.filter(item1 =>
            // Return item2 if not in array1
            !array2.some(item2 => (item2.id === item1.id))
        )
    }

    // Find the objects that have changed properties
    function findModifiedObjectsInArray(array1, array2) {
        let diffs = []
        array1.map(item1 => {
            array2.map(item2 => {
                if (item2.id === item1.id && !isSameObject(item2, item1)) {
                    diffs.push(item2)
                }
            })
        })
        return diffs
    }

    function isSameObject(obj1, obj2) {
        let isSame = true;
        for (var key in obj1) {
            if (obj1[key] != obj2[key]) {
                isSame = false;
                break;
            }
        }
        return isSame;
    }

    return patch;
}

console.log(generatePatch(oldDocument, updatedDocument))





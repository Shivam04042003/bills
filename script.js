var rowCount = 1;

function addRow() {
    var container = document.getElementById('container');
    var newRow = document.getElementById('Rose' + rowCount);
    if (!newRow) return; // If the desired row doesn't exist, exit the function
    newRow.style.display = 'block';
    rowCount++;
}

var RowCount = 1;

function AddRow() {
    var Container = document.getElementById('Container');
    var NewRow = document.getElementById('Pouch' + RowCount);
    if (!NewRow) return; // If the desired row doesn't exist, exit the function
    NewRow.style.display = 'block';
    RowCount++;
}

document.getElementById('billForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const customerName = document.getElementById('customerName').value;
    const roseWeightDropdown = document.getElementById('roseWeightDropdown').value;
    const roseWeightDropdown1 = document.getElementById('roseWeightDropdown1').value;
    const roseWeightDropdown2 = document.getElementById('roseWeightDropdown2').value;
    const roseWeightDropdown3 = document.getElementById('roseWeightDropdown3').value;
    const flower_type = document.getElementById('flower_type').value;
    const vehicleName = document.getElementById('vehicleName').value;
    const hammali = parseFloat(document.getElementById('hammali').value) || 5; // Default to 5 if not set

    // Parse input values or set default to 0
    const roseWeight = parseFloat(document.getElementById('roseWeight').value) || 0;
    const roseWeight1 = parseFloat(document.getElementById('roseWeight1').value) || 0;
    const roseWeight2 = parseFloat(document.getElementById('roseWeight2').value) || 0;
    const roseWeight3 = parseFloat(document.getElementById('roseWeight3').value) || 0;
    const roseRate = parseFloat(document.getElementById('roseRate').value) || 0;
    const roseRate1 = parseFloat(document.getElementById('roseRate1').value) || 0;
    const roseRate2 = parseFloat(document.getElementById('roseRate2').value) || 0;
    const roseRate3 = parseFloat(document.getElementById('roseRate3').value) || 0;
    const pouchQuantity = parseInt(document.getElementById('pouchQuantity').value) || 0;
    const pouchQuantity1 = parseInt(document.getElementById('pouchQuantity1').value) || 0;
    const pouchQuantity2 = parseInt(document.getElementById('pouchQuantity2').value) || 0;
    const pouchQuantity3 = parseInt(document.getElementById('pouchQuantity3').value) || 0;
    const pouchRate = parseFloat(document.getElementById('pouchRate').value) || 0;
    const pouchRate1 = parseFloat(document.getElementById('pouchRate1').value) || 0;
    const pouchRate2 = parseFloat(document.getElementById('pouchRate2').value) || 0;
    const pouchRate3 = parseFloat(document.getElementById('pouchRate3').value) || 0;
    const totalPouches = parseInt(document.getElementById('totalPouches').value) || 0;

    // Get fixed rates
    const roseRateFixed = parseFloat(document.getElementById('roseRateFixed').value) || 0;
    const pouchRateFixed = parseFloat(document.getElementById('pouchRateFixed').value) || 0;

    // Get comment value
    const comment = document.getElementById('comment').value;

    // Custom commission calculation function
    function calculateCommission(amount) {
        const baseAmount = Math.floor(amount / 100) * 100;
        return 0.1 * baseAmount;
    }

    // Calculate 'kiraya' based on fixed rates
    const kirayaRate = (roseWeight + roseWeight1 + roseWeight2+roseWeight3) * roseRateFixed + pouchRateFixed * (pouchQuantity + pouchQuantity1 + pouchQuantity2 + pouchQuantity3);

    // Initialize an array to store bill rows
    let billRows = [];

    // Add customer name and dropdowns to billRows array if they have values
    if (customerName.trim() !== "") {
        billRows.push(`किसान >> ${customerName}`);
    }
    // if (roseWeightDropdown.trim() !== "") {
    //     billRows.push(`TYPE 1: ${roseWeightDropdown}`);
    // }
    // if (roseWeightDropdown1.trim() !== "") {
    //     billRows.push(`TYPE 2: ${roseWeightDropdown1}`);
    // }
    // if (roseWeightDropdown2.trim() !== "") {
    //     billRows.push(`TYPE 3: ${roseWeightDropdown2}`);
    // }
    // if (roseWeightDropdown3.trim() !== "") {
    //     billRows.push(`Rose Weight Dropdown3: ${roseWeightDropdown3}`);
    // }

    // Generate bill rows dynamically based on input values
    if (roseWeight > 0 && roseRate > 0) {
        const roseTotal = roseWeight * roseRate;
        billRows.push(` ${roseWeightDropdown} ${roseWeight} kg X ${roseRate} Rs/kg = ${roseTotal.toFixed(2)} Rs`);
    }

    if (roseWeight1 > 0 && roseRate1 > 0) {
        const roseTotal = roseWeight1 * roseRate1;
        billRows.push(`${roseWeightDropdown1} ${roseWeight1} kg X ${roseRate1} Rs/kg = ${roseTotal.toFixed(2)} Rs`);
    }

    if (roseWeight2 > 0 && roseRate2 > 0) {
        const roseTotal = roseWeight2 * roseRate2;
        billRows.push(`${roseWeightDropdown2} ${roseWeight2} kg X ${roseRate2} Rs/kg = ${roseTotal.toFixed(2)} Rs`);
    }

    if (roseWeight3 > 0 && roseRate3 > 0) {
        const roseTotal = roseWeight3 * roseRate3;
        billRows.push(`${roseWeightDropdown3} ${roseWeight3} kg X ${roseRate3} Rs/kg = ${roseTotal.toFixed(2)} Rs`);
    }

    if (pouchQuantity > 0 && pouchRate > 0) {
        const pouchTotal = pouchQuantity * pouchRate;
        billRows.push(`${flower_type}  ${pouchQuantity} ${flower_type} X ${pouchRate} Rs/${flower_type} = ${pouchTotal.toFixed(2)} Rs`);
    }

    if (pouchQuantity1 > 0 && pouchRate1 > 0) {
        const pouchTotal = pouchQuantity1 * pouchRate1;
        billRows.push(`${flower_type} ${pouchQuantity1} ${flower_type} X ${pouchRate1} Rs/${flower_type} = ${pouchTotal.toFixed(2)} Rs`);
    }

    if (pouchQuantity2 > 0 && pouchRate2 > 0) {
        const pouchTotal = pouchQuantity2 * pouchRate2;
        billRows.push(`${flower_type} ${pouchQuantity2} ${flower_type} X ${pouchRate2} Rs/${flower_type} = ${pouchTotal.toFixed(2)} Rs`);
    }

    if (pouchQuantity3 > 0 && pouchRate3 > 0) {
        const pouchTotal = pouchQuantity3 * pouchRate3;
        billRows.push(`${flower_type} ${pouchQuantity3} ${flower_type} X ${pouchRate3} Rs/${flower_type} = ${pouchTotal.toFixed(2)} Rs`);
    }
   

    

    // if ((roseWeight + roseWeight1 + roseWeight2 + roseWeight3) > 0) {
    //     if ((pouchQuantity + pouchQuantity1 + pouchQuantity2) == 0) {
    //         billRows.push(`कुल वजन: ${roseWeight + roseWeight1 + roseWeight2 + roseWeight3} kg`);
    //     } else if ((pouchQuantity + pouchQuantity1 + pouchQuantity2) > 0) {
    //         billRows.push(`कुल वजन: ${roseWeight + roseWeight1 + roseWeight2 + roseWeight3} kg + ${pouchQuantity + pouchQuantity1 + pouchQuantity2} pouches`);
    //     }
    // }
    

    

    

    // Calculate total amount
    const totalAmount = (roseWeight * roseRate) + (roseWeight1 * roseRate1) + (roseWeight2 * roseRate2) + (roseWeight3 * roseRate3) +
        (pouchQuantity * pouchRate) + (pouchQuantity1 * pouchRate1) + (pouchQuantity2 * pouchRate2) + (pouchQuantity3 * pouchRate3);
    const commission = calculateCommission(totalAmount);
    const hammaliRate = totalPouches * hammali; // Use hammali value from input
    const finalResult = totalAmount - hammaliRate - commission - kirayaRate;

    const finalResult1 = totalAmount - hammaliRate;
    const finalResult2 = totalAmount - hammaliRate - commission;
    const finalResult3 = totalAmount - hammaliRate - commission - kirayaRate;

    // Push other rows to billRows array
    billRows.push(
        `टोटल अमाउंट : ${totalAmount.toFixed(2)} Rs`,);

    if ((roseWeight + roseWeight1 + roseWeight2 + roseWeight3) > 0) {
            if ((pouchQuantity + pouchQuantity1 + pouchQuantity2 + pouchQuantity3) == 0) {
                billRows.push(`कुल वजन :   ${roseWeight + roseWeight1 + roseWeight2 + roseWeight3} kg`);
            } else if ((pouchQuantity + pouchQuantity1 + pouchQuantity2) > 0) {
                billRows.push(`कुल वजन :   ${roseWeight + roseWeight1 + roseWeight2 + roseWeight3} kg + ${pouchQuantity + pouchQuantity1 + pouchQuantity2 + pouchQuantity3} pouches`);
            }
        }

    billRows.push(
        `हम्माली    :   - ${hammaliRate}   = ${finalResult1} Rs`,
        `कमीशन   :   - ${commission.toFixed(2)}   = ${finalResult2} Rs`,
        `किराया    :    - ${kirayaRate}   = ${finalResult3} Rs`,
        `**टोटल      :    ${finalResult.toFixed(2)} Rs**` // Bold the final result
        
    );

    // // Add comment to billRows if it has a value
    if (comment.trim() !== "") {
        billRows.push(` `);
        billRows.push(`**नोट: ${comment}**`);
    }

    billRows.push(`____________________________________________________`);
    // billRows.push(`**                     ~✨Happy Bhaidooj!" 🌸💫✨~**`);
    // billRows.push(`🎉May this Bhaidooj strengthen our bond with love, joy, and blessings. Happy Bhaidooj!" 🌸💫🪔✨`);
    // billRows.push(` `);
    billRows.push(`~This is System Generated Bill and Doesn't Require the Signature~`);
    billRows.push(` For Billing Issue, Contact: **8435694475**`);
    

    // Generate the bill dynamically
    const billText = billRows.join('\n');

    // Create a canvas to render the bill as an image
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 680;
    canvas.height = billRows.length * 30 + 150; // Adjust height based on number of rows

    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add "Kushwah Florist" at the top center of the image
    ctx.font = '30px Arial';
    var font2 = '16px Verdana';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('🥀🌹𝘒𝘜𝘚𝘏𝘞𝘈𝘏 𝘍𝘓𝘖𝘙𝘐𝘚𝘛🌹🥀', canvas.width / 2,70);
    ctx.font = font2;
    ctx.fillText('Flower Market, Kushwah Lodge, Near Rajhans Hotel, Bhopal (M.P)', canvas.width / 2, 93);
    ctx.font4 = ' 9px Arial';
    ctx.fillText('Prop. Banti Kushwah', canvas.width / 7, 25);
   
    ctx.fillText('Bill Receipt', canvas.width / 2, 25);
    ctx.fillText('__________', canvas.width / 2, 28);
    

    ctx.fillText('9165101282', canvas.width / 1.1, 25);
    ctx.fillText('8120256243', canvas.width / 1.1, 42);
    ctx.fillText('___________________________', canvas.width / 2, 70);
    ctx.fillText('____________________________________________________________', canvas.width / 2, 120);

    // ctx.fillText('____________________________________________________________', canvas.width / 2, 290);

    // Get the current date and format it
    const currentDate = document.getElementById('currentDate').value;
    const formattedDate = currentDate.split('-').reverse().join('/');
    // ctx.fillText(`Date: ${formattedDate}`, 500, 100);  // Adjust coordinates (650, 50) as needed

    ctx.font = '18px Arial';
    ctx.fillText(`Date: ${formattedDate}`, 580, 118); // Adjust position as needed

    ctx.textAlign = 'left';
    var y = 170; // Adjust vertical position based on date size and "Kushwah Florist"
    billRows.forEach(row => {
        if (row.startsWith('**')) {
            ctx.font = 'bold 20px Arial';
            row = row.replace(/\*\*/g, ''); // Remove the bold markers
        } else {
            ctx.font = '20px Arial';
        }
        ctx.fillText(row, 50, y);
        y += 30;

        // Add comment to billRows if it has a value
        // if (comment.trim() !== "") {
        //     billRows.push(`${comment}`);
        //     ctx.font2 = '12px Arial';  // Set font size and style
        //     ctx.fillText('नोट:', canvas.width / 40, 280);  // Draw the "नोट:" text
        //     ctx.fillText(comment, canvas.width / 40 + 40, 280);  // Draw the actual comment next to "नोट:"
        // }
       
    });

    // Convert canvas to image and display it
    var dataURL = canvas.toDataURL();
    document.getElementById('bill-image').src = dataURL;


    // Download button functionality
    document.getElementById('download-btn').addEventListener('click', function() {
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = `bill-${customerName}-${formattedDate}.png`; // Download file name
        link.click();
    });

    

    // Send data to the server
    try {
        let response = await fetch('/save-bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentDate: formattedDate,
                customerName,
                roseWeightDropdown,
                roseWeightDropdown1,
                roseWeightDropdown2,
                roseWeightDropdown3,
                roseWeight,
                roseWeight1,
                roseWeight2,
                roseWeight3,
                roseRate,
                roseRate1,
                roseRate2,
                roseRate3,
                pouchQuantity,
                pouchQuantity1,
                pouchQuantity2,
                pouchRate,
                pouchRate1,
                pouchRate2,
                totalPouches,
                roseRateFixed,
                pouchRateFixed,
                kirayaRate,
                totalAmount,
                commission,
                hammaliRate,
                finalResult,
                vehicleName,
                comment, // Include the comment in the data sent to the server
                billImage: dataURL
            })
        });
        let data = await response.json();
        console.log('Bill saved:', data);
    } catch (error) {
        console.error('Error:', error);
    }
});

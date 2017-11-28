function packingSlipHTML() {
  return `<html>
    <body>
      <h2>Toimituksen lähetyslista</h2>
      <p>Toimittaja: {{supplier.name}} ({{supplier._id}})</p>
      <p>Tuote: {{product.title}} ({{product._id}})</p>
      <p>Toimitusmäärä: {{deliveryQuantity}}</p>
      <p>Toimitussopimus: {{supplyContract._id}}</p>
      <p>Sopimuksen jäljellä oleva määrä: {{supplyContract.remainingQuantity}}</p>
    </body>
    </html>`;
}

export default packingSlipHTML;
import { Template } from "meteor/templating";
import SupplierProductsContainer from "../../containers/products/supplierProductsContainer";

Template.supplierProductsReact.helpers({
    SupplierProductsContainer() {        
        return SupplierProductsContainer;
    },
    checker() {
        console.log(SupplierProductsContainer);
        console.log("Check!");
    }
});
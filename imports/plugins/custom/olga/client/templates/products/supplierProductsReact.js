import { Template } from "meteor/templating";
import SupplierProductsContainer from "../../containers/products/supplierProductsContainer";

Template.supplierProductsReact.helpers({
    SupplierProductsContainer() {        
        return SupplierProductsContainer;
    }
});
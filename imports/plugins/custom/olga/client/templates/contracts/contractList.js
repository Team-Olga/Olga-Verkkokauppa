import { Template } from "meteor/templating";
import ContractContainer from "../../containers/contracts/contractContainer";

Template.contractList.helpers({
    ContractContainer() {
        return ContractContainer;
    }
});
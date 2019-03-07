module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            divisionList: boolean;
            warehouseList: boolean;
            facilityList: boolean; //added
            itemList: boolean;
            customerList: boolean;
            itemGroupList
        };
        divisionList: any;
        division: any;
        warehouseList: any;
        warehouse: any;
        facilityList: any; //added
        facility: any; //added
        itemList: any;
        item: any;
        customerList: any;
        customer: any;
        itemGroupList: any;
        itemGroup: any;
    }
}
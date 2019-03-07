module h5.application {
    export interface IItemMasterModule {
        
        reload: boolean;
        transactionStatus: {
            itemMasterList: boolean;
            
        };
        itemMasterList: any;
        itemMasterListGrid: IUIGrid;
        selectedItemMasterListRow: any;
    }
}
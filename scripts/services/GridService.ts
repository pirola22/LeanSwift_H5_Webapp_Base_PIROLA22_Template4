module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        private init() {
            this.baseGrid = {
                enableGridMenu: true,
                enableRowSelection: true,
                enableFullRowSelection: false,
                modifierKeysToMultiSelect: true,
                modifierKeysToMultiSelectCells: true,
                enableRowHeaderSelection: true,
                enableSelectAll: true,
                showGridFooter: true,
                showColumnFooter: true,
                enableColumnMenus: true,
                enableSorting: true,
                enableFiltering: true,
                flatEntityAccess: true,
                fastWatch: true,
                scrollDebounce: 500,
                wheelScrollThrottle: 500,
                virtualizationThreshold: 10,
                exporterCsvFilename: "grid_data.csv",
                exporterPdfFilename: "grid_data.pdf",
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
                    docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                    docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                    return docDefinition;
                },
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfHeader: {
                    columns: [
                        { text: 'H5 Application', style: 'pageHeader' }
                    ]
                },
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                columnDefs: [{}],
                data: []
            };
        }

        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }

        public clearGridStates() {
            let gridIds = ["sampleGrid1", "itemMasterListGrid", "customerMasterListGrid", "itemGroupListGrid"]; //added
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
            });

        }

        public getSampleGrid1(): IUIGrid {
            let sampleGrid1: IUIGrid = angular.copy(this.baseGrid);
            sampleGrid1.columnDefs = [
                { name: "division", displayName: this.languageService.languageConstants.get('Division') },
                { name: "payerNo", displayName: this.languageService.languageConstants.get('PayerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "customerNo", displayName: this.languageService.languageConstants.get('CustomerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "invoiceNo", displayName: this.languageService.languageConstants.get('InvoiceNo'), headerCellClass: "text-right", cellClass: "text-right" },
                {//DATE
                    name: "invoiceDate", displayName: this.languageService.languageConstants.get('InvoiceDate'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                    filters: [{ condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(64, searchTerm, cellValue) }, placeholder: '> =' },
                        { condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(256, searchTerm, cellValue) }, placeholder: '< =' }]
                }];
            sampleGrid1.exporterCsvFilename = "sample_list.csv";
            sampleGrid1.exporterPdfFilename = "sample_list.pdf";
            sampleGrid1.saveSelection = false;
            return sampleGrid1;
        }

        public getItemMasterListGrid(): IUIGrid {
            let itemMasterListGrid: IUIGrid = angular.copy(this.baseGrid);
            itemMasterListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "CONO", displayName: this.languageService.languageConstants.get('Company') },
                { name: "WHLO", displayName: this.languageService.languageConstants.get('Warehouse') },
                { //NUMBER
                    name: "STAT", displayName: this.languageService.languageConstants.get('Status'), headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]
                },
                { name: "ITNO", displayName: this.languageService.languageConstants.get('ItemNo') },
                { //FLOATING NUMBER
                    name: "EOQT", displayName: this.languageService.languageConstants.get('Order Quantity'), headerCellClass: "text-right", cellClass: "text-right", cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                    filters: [{ condition: (searchTerm, cellValue) => { return this.$filter('numberStrFilter')(64, searchTerm, cellValue) }, placeholder: '> =' },
                        { condition: (searchTerm, cellValue) => { return this.$filter('numberStrFilter')(256, searchTerm, cellValue) }, placeholder: '< =' }]
                },
                { name: "BUYE", displayName: this.languageService.languageConstants.get('Buyer') },
                { name: "SUNO", displayName: this.languageService.languageConstants.get('Supplier Number') },

            ];
            itemMasterListGrid.exporterCsvFilename = "sample_list.csv";
            itemMasterListGrid.exporterPdfFilename = "sample_list.pdf";
            itemMasterListGrid.saveSelection = false;
            return itemMasterListGrid;
        }

        public getItemGroupListGrid(): IUIGrid{
            let itemGroupListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.itemGroupModule.openItemGroupDetailModal(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            itemGroupListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "ITGR", displayName: this.languageService.languageConstants.get('Item Group'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "TX15", displayName: this.languageService.languageConstants.get('Name') },                                              
                { name: "TX40", displayName: this.languageService.languageConstants.get('Description') },
                { name: "SECU", displayName: this.languageService.languageConstants.get('Seasonal Curve') , headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]},
                { name: "TECU", displayName: this.languageService.languageConstants.get('Trend Curve') , headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]},
                { name: "TCWQ", displayName: this.languageService.languageConstants.get('Tolerance Catch Weight') , headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]},
                { name: "TCWP", displayName: this.languageService.languageConstants.get('Tolerance Catch Weight Percentage') , headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]}
            ];
            
            return itemGroupListGrid;
        }
        
        public getCustomerMasterListGrid(): IUIGrid {
            let customerMasterListGrid: IUIGrid = angular.copy(this.baseGrid);
            customerMasterListGrid.columnDefs = [
                { name: "CONO", displayName: this.languageService.languageConstants.get('Company'), },
                { name: "DIVI", displayName: this.languageService.languageConstants.get('Division') },
                { name: "CUNO", displayName: this.languageService.languageConstants.get('Customer Number') },
                { name: "CUNM", displayName: this.languageService.languageConstants.get('Customer Name') },
                { name: "CUA1", displayName: this.languageService.languageConstants.get('Address 1') },
                { name: "CUA2", displayName: this.languageService.languageConstants.get('Address 2') },
                { name: "ECAR", displayName: this.languageService.languageConstants.get('State/Area'), },
                { name: "PONO", displayName: this.languageService.languageConstants.get('Postal Code') },
                { name: "PHNO", displayName: this.languageService.languageConstants.get('Phone Number') },
                { name: "PHN2", displayName: this.languageService.languageConstants.get('Phone Number 2') },
                { name: "MAIL", displayName: this.languageService.languageConstants.get('Email') },
                { name: "CSCD", displayName: this.languageService.languageConstants.get('Country Code') }

            ];
            customerMasterListGrid.exporterCsvFilename = "sample_list.csv";
            customerMasterListGrid.exporterPdfFilename = "sample_list.pdf";
            customerMasterListGrid.saveSelection = false;

            return customerMasterListGrid;
        }
        

    }

}
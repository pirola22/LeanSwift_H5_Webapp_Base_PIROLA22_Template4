var h5;
(function (h5) {
    var application;
    (function (application) {
        var GridService = (function () {
            function GridService($filter, $timeout, storageService, languageService) {
                this.$filter = $filter;
                this.$timeout = $timeout;
                this.storageService = storageService;
                this.languageService = languageService;
                this.init();
            }
            GridService.prototype.init = function () {
                var _this = this;
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
                    exporterFieldCallback: function (grid, row, col, value) {
                        if (col.name.indexOf('Date') > 0) {
                            value = _this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                        }
                        return value;
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
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
                    exporterPdfFooter: function (currentPage, pageCount) { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                    exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                    exporterPdfMaxGridWidth: 700,
                    columnDefs: [{}],
                    data: []
                };
            };
            GridService.prototype.getBaseGrid = function () {
                return angular.copy(this.baseGrid);
            };
            GridService.prototype.adjustGridHeight = function (gridId, noOfRows, timeDelay) {
                noOfRows = (noOfRows < 1 ? 1 : noOfRows);
                this.$timeout(function () {
                    var newHeight = noOfRows > 15 ? 600 : (150 + noOfRows * 30);
                    angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
                }, timeDelay);
            };
            GridService.prototype.saveGridState = function (gridId, gridApi) {
                var gridState = gridApi.saveState.save();
                this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
            };
            GridService.prototype.restoreGridState = function (gridId, gridApi) {
                var gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
                if (gridState) {
                    this.$timeout(function () {
                        gridApi.saveState.restore(undefined, gridState);
                    }, 100);
                }
            };
            GridService.prototype.clearGridStates = function () {
                var _this = this;
                var gridIds = ["sampleGrid1", "itemMasterListGrid", "customerMasterListGrid", "itemGroupListGrid"];
                gridIds.forEach(function (gridId) {
                    _this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
                });
            };
            GridService.prototype.getSampleGrid1 = function () {
                var _this = this;
                var sampleGrid1 = angular.copy(this.baseGrid);
                sampleGrid1.columnDefs = [
                    { name: "division", displayName: this.languageService.languageConstants.get('Division') },
                    { name: "payerNo", displayName: this.languageService.languageConstants.get('PayerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    { name: "customerNo", displayName: this.languageService.languageConstants.get('CustomerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    { name: "invoiceNo", displayName: this.languageService.languageConstants.get('InvoiceNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    {
                        name: "invoiceDate", displayName: this.languageService.languageConstants.get('InvoiceDate'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                        filters: [{ condition: function (searchTerm, cellValue) { return _this.$filter('m3DateFilter')(64, searchTerm, cellValue); }, placeholder: '> =' },
                            { condition: function (searchTerm, cellValue) { return _this.$filter('m3DateFilter')(256, searchTerm, cellValue); }, placeholder: '< =' }]
                    }];
                sampleGrid1.exporterCsvFilename = "sample_list.csv";
                sampleGrid1.exporterPdfFilename = "sample_list.pdf";
                sampleGrid1.saveSelection = false;
                return sampleGrid1;
            };
            GridService.prototype.getItemMasterListGrid = function () {
                var _this = this;
                var itemMasterListGrid = angular.copy(this.baseGrid);
                itemMasterListGrid.columnDefs = [
                    { name: "CONO", displayName: this.languageService.languageConstants.get('Company') },
                    { name: "WHLO", displayName: this.languageService.languageConstants.get('Warehouse') },
                    {
                        name: "STAT", displayName: this.languageService.languageConstants.get('Status'), headerCellClass: "text-right", cellClass: "text-right",
                        filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]
                    },
                    { name: "ITNO", displayName: this.languageService.languageConstants.get('ItemNo') },
                    {
                        name: "EOQT", displayName: this.languageService.languageConstants.get('Order Quantity'), headerCellClass: "text-right", cellClass: "text-right", cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                        filters: [{ condition: function (searchTerm, cellValue) { return _this.$filter('numberStrFilter')(64, searchTerm, cellValue); }, placeholder: '> =' },
                            { condition: function (searchTerm, cellValue) { return _this.$filter('numberStrFilter')(256, searchTerm, cellValue); }, placeholder: '< =' }]
                    },
                    { name: "BUYE", displayName: this.languageService.languageConstants.get('Buyer') },
                    { name: "SUNO", displayName: this.languageService.languageConstants.get('Supplier Number') },
                ];
                itemMasterListGrid.exporterCsvFilename = "sample_list.csv";
                itemMasterListGrid.exporterPdfFilename = "sample_list.pdf";
                itemMasterListGrid.saveSelection = false;
                return itemMasterListGrid;
            };
            GridService.prototype.getItemGroupListGrid = function () {
                var itemGroupListGrid = angular.copy(this.baseGrid);
                var footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";
                var gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.itemGroupModule.openItemGroupDetailModal(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
                itemGroupListGrid.columnDefs = [
                    { name: "ITGR", displayName: this.languageService.languageConstants.get('Item Group'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },
                    { name: "TX15", displayName: this.languageService.languageConstants.get('Name') },
                    { name: "TX40", displayName: this.languageService.languageConstants.get('Description') },
                    { name: "SECU", displayName: this.languageService.languageConstants.get('Seasonal Curve'), headerCellClass: "text-right", cellClass: "text-right",
                        filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }] },
                    { name: "TECU", displayName: this.languageService.languageConstants.get('Trend Curve'), headerCellClass: "text-right", cellClass: "text-right",
                        filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }] },
                    { name: "TCWQ", displayName: this.languageService.languageConstants.get('Tolerance Catch Weight'), headerCellClass: "text-right", cellClass: "text-right",
                        filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }] },
                    { name: "TCWP", displayName: this.languageService.languageConstants.get('Tolerance Catch Weight Percentage'), headerCellClass: "text-right", cellClass: "text-right",
                        filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }] }
                ];
                return itemGroupListGrid;
            };
            GridService.prototype.getCustomerMasterListGrid = function () {
                var customerMasterListGrid = angular.copy(this.baseGrid);
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
            };
            GridService.$inject = ["$filter", "$timeout", "StorageService", "languageService"];
            return GridService;
        }());
        application.GridService = GridService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));

module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getItemList(company: string, warehouse: string): ng.IPromise<M3.IMIResponse>;
        getCustomerList(company: string): ng.IPromise<M3.IMIResponse>;
        getItemGroupList(): ng.IPromise<M3.IMIResponse>;
        addItemGroup(itemGroup: string, description: string, name: string, seasonalCurve: string, trendCurve: string, tolerancePercent: string, toleranceWeight: string): ng.IPromise<M3.IMIResponse>;
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";
                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                        if (angular.equals([], val.items)) {
                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length() && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                } else {
                    let test = val.item.ALO;
                    if (charAt < test.length() && '1' == test.charAt(charAt)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }

        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getWarehouseList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getItemList(company: string, warehouse: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                WHLO: warehouse
            }
            return this.restService.executeM3MIRestService("MMS200MI", "LstItmWhsByWhs", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getCustomerList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            }
            return this.restService.executeM3MIRestService("CRS610MI", "LstByName", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getItemGroupList(): ng.IPromise<M3.IMIResponse> {

            let requestData = {

            }
            return this.restService.executeM3MIRestService("CRS025MI", "LstItemGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public addItemGroup(itemGroup: string, description: string, name: string, seasonalCurve: string, trendCurve: string, tolerancePercent: string, toleranceWeight: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITGR: itemGroup,
                TX40: description,
                TX15: name,
                SECU: seasonalCurve,
                TECU: trendCurve,
                TCWP: tolerancePercent,
                TCWQ: toleranceWeight
            }
            return this.restService.executeM3MIRestService("CRS025MI", "AddItemGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }


    }
}
/*global XLSX*/
sap.ui.define([
    "sap/ui/core/mvc/Controller"
    /*global XLSX*/
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    /*global XLSX*/
    function (Controller) {
        "use strict";

        return Controller.extend("project1.controller.Overview", {
            onInit: function () {

              debugger;

              var that = this;

              // Load xlsx library dynamically
              jQuery.sap.includeScript({
                  url: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js",
                  success: function() {
                      // xlsx library is loaded successfully
          
                      // FileUploader change event to handle file upload
                      var oFileUploader = that.byId("fileUploader");
                      oFileUploader.attachChange(function (oEvent) {
                          var uploadedFile = oEvent.getParameter("files")[0];
          
                          var reader = new FileReader();
          
                          reader.onload = function (event) {
                              var data = new Uint8Array(event.target.result);
                              var workbook = XLSX.read(data, { type: 'array' });
          
                              // Assuming you want to convert the first sheet of the workbook
                              var firstSheetName = workbook.SheetNames[0];
                              var worksheet = workbook.Sheets[firstSheetName];
          
                              // Convert the worksheet to JSON format
                              var jsonData = XLSX.utils.sheet_to_json(worksheet);
          
                              // Use 'jsonData' as needed, maybe send it to an API, manipulate it, etc.
                              console.log(jsonData);
                          };
          
                          reader.readAsArrayBuffer(uploadedFile);
                      });
                  },
                  error: function() {
                      // Handle error if xlsx library fails to load
                      console.error("Failed to load xlsx library");
                  }
              });

              








              

            },
            
            onPress: function () {

           
                debugger;

              var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_SERVICE_EXP_REPORT_V2/", true);

              var Create = {

                PurchaseOrder: "123213",
                PurchaseOrderItem:"0010"
            
            }

            var data =  [];

            data.push(Create);
				

                const fnSuccess = (Response) => {
debugger;           




                   

                }

                const fnError = (oError) => {
             debugger;



                }

    

                var sMainEntityPath = "/PurchaseOrder('4500000001')"

                oModel.create(sMainEntityPath + "/to_item", create, {
                  success: fnSuccess,
                   error: fnError






             });

             
         
      




            }, 

            onUpload: function (e) {
              debugger;
              this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },
            
            _import: function (file) {
              var that = this;
              var excelData = {};
              if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                  var data = e.target.result;
                  var workbook = XLSX.read(data, {
                    type: 'binary'
                  });
                  workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object for every sheet in workbook
                    excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        
                  });
                  // Setting the data to the local model 
                  that.localModel.setData({
                    items: excelData
                  });
                  that.localModel.refresh(true);
                };
                reader.onerror = function (ex) {
                  console.log(ex);
                };
                reader.readAsBinaryString(file);
              }
            },

            onPress2: function () {
                debugger;
      // Create the OData model
var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_SERVICE_EXP_REPORT_V2/", {
    useBatch: true
  });
  
  // Function to create a POST request and return a promise
  function createPostRequest(entity, data) {
    return new Promise(function(resolve, reject) {
      oModel.create("/" + entity, data, {
        success: function(oData, oResponse) {
          resolve({ data: oData, response: oResponse });
        },
        error: function(oError) {
          reject(oError);
        }
      });
    });
  }
  
  // Define the POST request data
  var postData1 = {
    PurchaseOrder: "4500000001",
    PurchaseOrderItem: "00010"
  };
  
  var postData2 = {
    PurchaseOrder: "4500000001",
    PurchaseOrderItem: "00020"
  };
  
  // Create an array of promises for each create operation
  var promises = [
    createPostRequest("purchaseOrderItem", postData1),
    createPostRequest("purchaseOrderItem", postData2)
  ];
  
  // Execute all promises concurrently using Promise.all
  Promise.all(promises)
    .then(function(results) {
      // All requests have been completed successfully
      console.log("All requests completed:", results);
    })
    .catch(function(error) {
      // At least one request has failed
      console.error("Error in one or more requests:", error);
    });
  
  
            },

            handleUploadPress: function () {
              debugger;
 
            
              var oFileUploader = this.byId("fileUploader");
				var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_SERVICE_EXP_REPORT_V2/");
           
              var oFile = oFileUploader.oFileUpload.files[0]; // Access the file from the FileUploader control

              this.fileName = oFile;

			var that = this; 

            	var oReader = new FileReader();
			oReader.onload = function (oReadStream) {
				//Get the number of columns present in the file uploaded & convert the regex unformatted stream
				//to array. This will be parsed at the backend SAP
				//var noOfcolumn = oReadStream.currentTarget.result.match(/[^\r\n]+/g)[0].split("\t").length;
				//var binContent = oReadStream.currentTarget.result.match(/[^\r\n\t]+/g);

        var data = oReadStream.currentTarget.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
var   excelData = [];
        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object for every sheet in workbook
          excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

        });


				var payload = {
					"Value": excelData
				};

			

      var payloadValues = payload.Value; // Get values from payload.Value

    // Concatenate array values into a single string variable 'Create'
    var Create = payloadValues.join(' ');

    // Concatenate array values into a single string variable 'Create'
    var Create = {
		VALUE : Create
	};

		
				
				

		

				//Call a CREATE_STREAM activity
				oModel.create("/Upload", Create, {
			
					success: function (oData, oResponse) {
						MessageToast.show("Data Uploaded Successfully!");
					},
					error: function (oError) {
						MessageToast.show("Data Uploaded Failed!");
					}
				});

			};

			// Read the file as a binary String. Do not read URI, you have to encode before sending
			oReader.readAsBinaryString(oFile);


          

            },   

            onPress3: function () {

              debugger;
              var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_SERVICE_EXP_REPORT_V2/");


              
              const fnSuccess = (Response) => {
                debugger;           
                
                
                
                
                                   
                
                                }
                
                                const fnError = (oError) => {
                             debugger;
                
                
                
                                }
                

                                var Create = {

                                  ZKEY: "2",
                                  VALUE:"0010"
                              
                              }
                    
                
                                var sMainEntityPath = "/Upload"
                
                                oModel.read(sMainEntityPath, {
                                  success: fnSuccess,
                                   error: fnError
                
                
                
                
                
                
                             });
                




            },

            GetTemplate: function () {

 var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_SERVICE_EXP_REPORT_V2/");

 const fnSuccess = (Response) => {
  debugger;        
  debugger;        
  
  // Assuming Response.results[0].Value contains the xstring value
var xstringValue = Response.results[0].Value;

	 var hexString = xstringValue;

// Function to convert a hexadecimal string to a byte array
function hexStringToByteArray(hexString) {
    var bytes = [];
    for (var i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return bytes;
}

// Convert hexadecimal string to byte array
var byteArray = hexStringToByteArray(hexString);

// Convert byte array to a Blob
var blob = new Blob([new Uint8Array(byteArray)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

// Trigger download by providing a file name
var fileName = 'example.xlsx'; // Specify the desired file name
downloadBlob(blob, fileName); // Use downloadBlob function to save the Blob as a file

// Function to trigger download of the Blob as a file
function downloadBlob(blob, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        // For IE and Edge
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        // For other browsers
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
  
                
                  }
  
                  const fnError = (oError) => {
               debugger;
  
  
  
                  }


 var sMainEntityPath = "/Download"
                
 oModel.read(sMainEntityPath, {
   success: fnSuccess,
    error: fnError






});









              
            }
            
        });
    });

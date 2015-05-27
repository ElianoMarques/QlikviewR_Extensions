
var template_path = Qva.Remote + "?public=only&name=Extensions/R/";
// Global Default Settings
var _MaxRecords_Default = 250;
var _Label_Submit = 'Submit';


//Qv.LoadExtensionScripts('/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/RBIPAT/jquery-1.10.2.min.js');
//Qva.LoadScript('/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/RBIPAT/jquery-1.10.2.min.js');

//Load 
		 /* var qvDoc = Qv.GetCurrentDocument();
		 var qvObj = qva.GetQvObject('CH12',function() {});
		 var qvObjData = qvObj.Data;	 
		 alert(qvObj.length); */
//CSS


function Test_Init() {
	Qva.AddExtension("R",
         function () {
		 Qva.LoadCSS(template_path + "style.css");
		 Qva.LoadScript('/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/R/opencpu-0.4.js');
		
		 //Best Practice
		 var _this = this;
 
		 //Proprieties
		 var RServer = _this.Layout.Text0.text.toString();
		 var ButtonLabel = _this.Layout.Text1.text.toString();
		 var RCode = _this.Layout.Text2.text.toString();
		 // Max records
         _this.MaxRecords = $.isNumeric(_this.Layout.Text4.text) ? parseInt(_this.Layout.Text4.text) : _MaxRecords_Default;
         _this.Data.SetPagesizeY(_this.MaxRecords);
		 //
		 var data =  _this.Layout.Text4.text.toString();
		 var path =  _this.Layout.Text5.text.toString();
		 var divGeneral = _this.Layout.ObjectId.replace("\\", "_");
		 
//alert( _this.Layout.Text2.text.toString() +'& ' +  _this.Layout.Text3.text.toString() +'& ' + _this.Layout.Text4.text.toString() + '& ' + _this.Layout.Text5.text.toString()   );
		 var routput= _this.Layout.Text6.text.toString() ; //_this.Layout.Text10.text.toString();
		 //var routput= 't';
		 if(routput=='t') {var divName='ROutputsTable';}  else {if(routput=='p') {var divName='ROutputsPlot';} else {var divName='ROutputsHC';}}; 
		 
		 
		 //Data     
	     // Create a variable to hold generated html 
		 //Headers
		 var headerRows = _this.Data.HeaderRows;
		 var DataObj = "<table><thead><tr>";
         for (var r = 0, max = headerRows.length; r < max; r++) {
            var rowData = headerRows[r];
            for (var c = 0; c < rowData.length; c++) {
                var cell = rowData[c];
                DataObj+= "<td>" + cell.text + "</td>";
				};
			};
		 DataObj += "</tr></thead><tbody>";
		 // Cycle Through the data 
		 for (var i = 0; i < _this.Data.Rows.length; i++) 
				{ 
					DataObj += '<tr>';
					var rowData = _this.Data.Rows [i];
					 for (var c = 0; c < rowData.length; c++) {
					var cell = rowData[c];
					DataObj+= "<td>" + cell.text + "</td>";
					};
				};
		 // Finalise the html 
		 DataObj += "</tbody></table>";
		 //Data Loaded
		 
		 //StartButton Function
		 Startbutton();

		 function Startbutton() {
		 
		  //$(_this.Element).empty();
		  function postData(RServer) {			
				document.getElementById(divName).innerHTML = 'Trying to run R';
				ocpu.seturl(RServer);
                var req = ocpu.call("QlikFunction_ReadRCode", {
				RCode: RCode,
				data: data,
				path: path
				}, function(session) {
					session.getObject(function(data){
					//alert(data);
					/*temp=data.replace("[", ""); 
					temp=temp.replace("]","");
					temp=temp.replace('"<','<') ;
					temp=temp.replace('n"','n');
					temp=temp.replace(/\\n/g,"");
						
					var GetResults = data.replace(/\\n/g,"");
					//var GetResults=data;
					//var headerRows = GetResults.Data.HeaderRows;
					//alert (data[1].text); */
					document.getElementById(divName).innerHTML = data; 

					});
				});
				 //Second row of the table with timestamp. To do the table
				req.fail(function() {
										var response= "R returned an error: " + req.responseText;
										document.getElementById(divName).innerHTML = response;
										});
	
			}
			
			function postDataPlot(RServer) {		
				document.getElementById(divName).innerHTML = 'Trying to run R';
				ocpu.seturl(RServer);
                var req = $("#"+divName).rplot("QlikFunction_ReadRCode", {
				RCode: RCode,
				data: data,
				path: path
				});
				 //Second row of the table with timestamp. To do the table
				req.fail(function() {
										var response= "R returned an error: " + req.responseText;
										document.getElementById(divName).innerHTML = response;
										});		
			}
			
			function postDataHTML(RServer,path) {		
			Qva.LoadScript('/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/Test/highcharts.js'); 
				 document.getElementById(divName).innerHTML = 'Trying to load Highcharts';
				_this.Element.appendChild(divExt);
				 //alert(divName);
				$("#ROutputsHC").highcharts({
				chart: {
				type: 'bar'
				},
				title: {
				text: 'Fruit Consumption'
				},
				xAxis: {
				categories: ['Apples', 'Bananas', 'Oranges']
				},
				yAxis: {
				title: {
                text: 'Fruit eaten'
				}
				},
				series: [{
				name: 'Jane',
				data: [1, 0, 4]
				}, {
				name: 'John',
				data: [5, 7, 3]
				}]
				});
			}

		function exportData(data, path, DataObj){
			 document.getElementById(divName).innerHTML = 'Trying to export';
			 ocpu.seturl(RServer);
                var req = ocpu.call("QlikFunction_LoadData", {
				data: data,
				path: path,
				DataObj: DataObj
				}, function(session) {
				});
				req.fail(function() {
										var response= "R returned an error reading the data: " + req.responseText;
										document.getElementById(divName).innerHTML = response;																	
										});
				req.done(function() {
										var response = "R loaded the data successfully";
										document.getElementById(divName).innerHTML = response;
										if(routput=='t') {postData(RServer);} 
											else {
													if(routput=='p') {postDataPlot(RServer);}
														else {
														postDataHTML(RServer,path);
																};
												};
										});
			}

					
		function button_click() {
		    var divTextExt= document.createElement("div");
			 divTextExt.setAttribute("id",divName);
             divTextExt.setAttribute("class", "DivOutput");
			divExt.appendChild(divTextExt);
			 _this.Element.appendChild(divExt);
			 //First row of a table with timestamp. To do the table
			 exportData(data,path, DataObj);
			 document.getElementById(divName).innerHTML = 'Executing';			 			 
			 //
			 
			 }

		//render html
		var divExt = document.createElement("div");
                divExt.setAttribute("id", divGeneral);
                divExt.setAttribute("class", "DivGeneral");
		 //creation of a button
		  var divButtonExt= document.createElement("div");
                divButtonExt.setAttribute("class", "DivButton");
		//var button='<button name="button">Click me</button>';
		 var divButton = document.createElement("BUTTON"); 
                //divButton.setAttribute("href", "javascript:void(0);");
                divButton.setAttribute("id", "button_123");
                divButton.setAttribute("class", "TestButton");
                divButton.innerText= "Run R";
				divButton.addEventListener("click", button_click, false);
		 divButtonExt.appendChild(divButton);
		 //divExt.appendChild(html);
		 divExt.appendChild(divButtonExt);
		_this.Element.appendChild(divExt);
		//end of rendering html
	
		
         }
		
		}, false);	
	}
	Test_Init();
	
//Things missing: Create Table with Process Tasks (e.g. Executing, R run successfully, Reload Complete);
// Add Ajax Task Call Code; Finalise R Code to Read Html tables ; Think about the process for multiple users ; 
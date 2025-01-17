﻿main();

//basic declaration of interaction levels to override link/font warnings to ease batch run
function main(){
    //app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
    if(app.documents.length != 0){
		if (app.activeDocument.stories.length != 0){
              myFolder = ("U:/")
              expFormat = ".txt"
              myExportPages(expFormat, myFolder)
              //myExportLinks(
              $.gc()
              }
          else alert("The document does not contain any text. Please open a document containing text and try again.");
          }
      else alert("No documents are open. Please open a document and try again.");
}

function myExportPages(myExportFormat, myFolder){
    
    var curDate = new Date();
    myFileName = "ak.DataMine_" + curDate.toDateString()+ myExportFormat;
    myFilePath = myFolder + "/" + myFileName;
    var myFile = new File(myFilePath);
    
//resolves the lack of indexOf function   
if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }  
}                  
    //var basicMasters = ["A-Master","B.1-Project Team (Headshots)","B.2-Project Team (Group Photo)","B.3-Project Details","C.1-P
    
    //array of unfilled values to check for
    var phArr = ["•	Predicted Energy Use Intensity- pEUI (kBTU/sf/yr):  Enter Value (if applicable)</P><P>•	Energy Savings (% reduction from the baseline):  Enter Value</P><P>","Type your Body Text here", "Type your Body Text here</P><P>Type your Body Text here</P><P>Type your Body Text here</P><P>Type your Body Text here</P><P>","Briefly describe sustainability goals and strategies (i.e.  Sustainability Strategies Checklist)</P><P>Type your text here"]
        
    //project title reference index to used while checking for add/modify
    var titlesIndex = [];
    
    //file information 
    var fileArr = ["\"" + "\"","\"" + "\"","\"" + "\""];
    
    //creates null array of projects on the page, to be either modified or added to with pageRow
    var projIndex = [[]];
    projIndex.pop();
    
    var linkBucket = [{}];
    linkBucket.pop();
    
    var linkIndex = [{}];
    linkIndex.pop();
    
    //load file info array into project index of filepath, modify date
    fileArr[0] = csvQuotes(app.activeDocument.fullName.toString().replace("/g/","G:/"));
    fileArr[1] = csvQuotes(File(app.activeDocument.fullName).modified);
    
    //fill row with null values at first
    var pageRow = [];
    for(pR = 0; pR < 13 ; pR++) pageRow[pR] = ("\"" + "\"");
    //input filepath into pageRow
    
    //("Path"),("Modified"),("Office"),("Project Name"),("Project Number"),("Location"),("Practice Area"),("Construction Type"),("Size"),("Estimated Cost"),("Estimated Completion"),("Sustainability"),("Project Description"),("Team")]
    //q4 2019 locations array
    var locArr1 = [1.638,2.3902,3.1502,3.8978,4.651,5.4052,6.1586,6.9531]
    //option 2 locations array
    var locArr2 = [1.638,2.2874,2.9445,3.5894,4.2398,4.8912,5.5442,6.2071,2.04]
    //option 3 locations array
    var locArr3 = [1.635,2.2744,2.9215,3.5564,4.1968,4.8382,5.4793,5.5951]
    //Q2 2020 option 4 locations array with Y-values
    var templateBoxes = [{name: "projNumber", x: 10.0119, y: 2.9414, val: ""},
    {name: "projName", x : 0.375, y: 0.6097, val: ""},
    {name: "location", x: 8.0812, y: 1.638, val: ""},
    {name: "practiceArea", x: 8.0812, y: 2.2874, val: ""},
    {name: "constructionType", x: 8.0812, y: 2.9445, val: ""},
    {name: "projSize", x: 8.0812, y: 3.5894, val: ""},
    {name: "estCost", x: 10.0133, y: 1.637, val: ""},
    {name: "estCompletion", x: 10.0119, y: 2.2883, val: ""},
    {name: "projDescription", x: 8.0812, y: 4.3381, val: ""},
    {name: "sustainability", x: 8.0804, y: 6.9089, val: ""},
    {name: "designIntent", x: 11.9375, y: 1.6489, val: ""},
    {name: "aiaChallenge", x: 11.9375, y: 6.9089, val: ""},
    {name: "projTeam", x: 0.3719, y: 7.7462, val: ""}];
    
    var locArr5 = [1.22,2.2744,2.9215,3.5564,4.1968,4.8382,5.4793,5.5951]

    //declaration of textbox layout array--the default is Q3 2018 layout
    //var templateBoxes = locArr4;    
    //pulls the first master spread to determine the prototypical layout of the open doc    
    mSpread = app.activeDocument.masterSpreads.item(0);
    
    //checks for footer title for textbox location options 1 or 3. if match, sets reference array equal
    for(a=0;a<mSpread.textFrames.length;a++){
        if (mSpread.textFrames.item(a).parentStory.contents == "DESIGN ON THE BOARDS      Q-4 2019") posList = locArr1;
        if (mSpread.textFrames.item(a).parentStory.contents == "DESIGN ON THE BOARDS      Q-4 2017") posList = locArr3;
        }
    
    //iterating through spreads of document (spreads are designated instead of pages to accommodate spreads of multiple sheets with common information)
    for(myCounter = 0; myCounter < app.activeDocument.pages.length; myCounter++){
        //get current page
        myPage = app.activeDocument.pages.item(myCounter);
        
        myLinks = app.activeDocument.links;
        
        for (w=0;w<myLinks.length;w++) if (myLinks[w].parent.parentPage.name == myCounter && myLinks[w].name.indexOf("_mr") == -1) linkBucket.push(myLinks[w]);
        
        //alert(linkBucket);
        //alert(pageRow.length);
        for (z = 0; z <pageRow.length;z++) pageRow[z] = csvQuotes(csvFriendly(templateBoxes[z].val));
        
        modify = false;
        //pageRow is initialized as empty, with project values set to empty strings
        
        pageRow = [];
        for(pR = 0; pR < 13 ; pR++) pageRow[pR] = ("\"" + "\"");
        
         //ungroups any layers within the document, if there are any.                  
         for(z=0;z<myPage.groups.length;z++){
                //alert(z);
                checkGroup = myPage.groups.item(z);
                checkGroup.ungroup(); 
            }
        
     for (h = 0;h <templateBoxes.length;h++){
         for (j = 0;j <myPage.textFrames.length;j++){
             myPosition = myPage.textFrames[j].geometricBounds;
             if (approx(myPosition[0],templateBoxes[h].y) && approx(myPosition[1],templateBoxes[h].x) && templateBoxes[h].val == "") templateBoxes[h].val = myPage.textFrames[j].parentStory.contents;}
         }
     
     for (z = 0; z <pageRow.length;z++){
         pageRow[z] = csvQuotes(csvFriendly(templateBoxes[z].val));
         //alert(pageRow);
         }
     
 
     
   
   if (pageRow[0] !== "\""+ "\"" && pageRow[0] !== "" && projIndex[projIndex.length-1] !== pageRow && modify == false){
        // dirTitle = templateBoxes[0].val + "_" + templateBoxes[1].val;
       dirTitle = templateBoxes[0].val;
       //alert(dirTitle);
       writeDataAndLinks(fileArr,pageRow,myFile);
       exportLinks(dirTitle,linkBucket);
       projIndex.push(pageRow);
       //alert(pageRow[0] + "_is currently being added. the projectindexlength is now " +projIndex.length + " and the list as follows is: " );
       //alert(projIndex[projIndex.length-1] + " added. this is from page " + myCounter);
       
       }
    //alert("length of project index " + projIndex.length);
    for (e=0;e<templateBoxes.length;e++) templateBoxes[e].val = "";

//alert("projIndex is currently " + projIndex);
//dataAndLinks(fileArr,projIndex,linkIndex,myFile);
}
}
function writeDataAndLinks(fileArr,pR,myFile){
        //alert(pR);
        myPageText = fileArr.toString() +"\," + pR.toString() + "\n";        
        //alert("adding to export: "+ pR);
        writeFile(myFile,myPageText);
        }
    
function exportLinks(dT,getLinks){
//alert(getLinks.length);
   for (l = 0; l < getLinks.length; l++){
        //var eachLink = new Link();
        eachLink = getLinks[l];
        //alert("The current link is: " + elPath);        
        //alert(projName + " " + projNum);
        //savePath = "U:/ExportedLinks/";
        //projNum = projNum.replace("\"",'_')
        savePath = "U:/ExportedLinks/"+dT;
        //alert(projNum);
        var myFolder = new Folder(savePath);
        myFolder.create();
        //alert(myFolder);
        //eachLink.copyLink(savePath,"",false);
        //alert("copying file from "+ eachLink.filePath);
        eachLink.copyLink(savePath,"",true);
        //eachLink.copyLink(savePath+"/"+eachLink,"copied",true);
        //linkArr.push("\"" + eachLink + "\"");
        }
    
  return getLinks;
  }

//sets encoding properties and writing components
function writeFile(fileObj, fileContent, encoding) {  
    encoding = encoding || "UTF-8";
    var titleRow = [csvQuotes("Path"),csvQuotes("Modified"),csvQuotes("Office"),csvQuotes("Project Name"),csvQuotes("Project Number"),csvQuotes("Location"),csvQuotes("Practice Area"),csvQuotes("Construction Type"),csvQuotes("Size"),csvQuotes("Estimated Cost"),csvQuotes("Estimated Completion"),csvQuotes("Sustainability"),csvQuotes("Project Description"),csvQuotes("Team")];
    if (!fileObj.exists) fileContent2 = titleRow.toString() + "\n" + fileContent;
    else fileContent2 = fileContent;
         
    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);  
  
    var parentFolder = fileObj.parent;
    if (!parentFolder.exists && !parentFolder.create())  
        throw new Error("Cannot create file in path " + fileObj.fsName);  
  
    fileObj.encoding = encoding;  
    fileObj.open("a");  
    fileObj.write(fileContent2);  
    fileObj.close();
    
    return fileObj;  
}  

//function copyLinks(

//convert text into compatible csv format--REPLACE </P><P> WITH PARAGRAPH BREAK FOR HTML FORMATTING AND #% WITH COMMA
 
 //creates function to compare numbers to see if two are approximately the same
function approx(number,reference,delta){
    var delta = .02;
    if (Math.abs((number - reference)) <= delta || Math.abs((reference - number)) <= delta) return true
    else return false
    }

//3 functions to rework text into quotes/HTML format for the purposes of being loaded into a workable CSV
function csvQuotes(myText){
    myText = ("\"" + trim(myText) + "\"");
    return myText
}

function csvFriendly(myText){
    myText = trim(myText.toString().replace(/(\r\n|\n|\r)/gm,"</P><P>").replace(/,/g,"#%"));
    return myText;
 }
 
function trim(str) {
    return str.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

//logging function used for debugging purposes
function logMe(input){
     var now = new Date();
     var output = now.toTimeString() + ": " + input;
     $.writeln(output);
     var logFile = File("/path/to/logfile.txt");
     logFile.open("e");
     logFile.writeln(output);
     logFile.close();
}



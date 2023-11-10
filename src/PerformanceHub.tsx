import React, { useState, useEffect, useRef, ReactNode, ReactElement } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp, executeTML, executeTMLInput, AnswerService} from '@thoughtspot/visual-embed-sdk';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiUsers,
    FiUser
  } from 'react-icons/fi';
  import {
    LiveboardEmbed,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
//import demographicImage from './demographics.png'

//@ts-ignore
import demographicImage from './demographics.png'
import SalesTab from './tabs/SalesTab';
import CategoryTab from './tabs/CategoryTab';
import CustomerTab from './tabs/CustomerTab';
import StoreTab from './tabs/StoreTab';
import { MultiSelect } from 'react-multi-select-component';
import './Tabs.css'
import { Tab } from './tabs/Tab';

import customersImage from './images/customers.png'
import storeImage from './images/store.png'
import salesImage from './images/sales.png'
import categoriesImage from './images/categories.png'
import { link } from 'fs';
import BrowsePage from './Browse';
import { servicesVersion } from 'typescript';
import { CustomActionPayload } from '@thoughtspot/visual-embed-sdk/lib/src/types';

enum SelectedRole {
    ADMIN = 'Admin',
    CAT = 'Category Manager',
    STORE = 'Brand Manager',
    SALES = 'Sales Leader'
}
export enum SelectedTab {
    NONE = 'None',
    ALL = 'Performance Hub',
    SALES = 'Sales Insights',
    CUSTOMER = 'Customer Insights',
    STORE = 'Store Insights',
    CATEGORY = 'Category Insights',
    MY = "My Liveboards",
}
type RESTFilter = {
    col1: string,
    op1: string,
    val1?: any[],
    col2: string,
    op2: string,
    val2?: any[]
}



interface TabViewProps{
    tsURL: string,
    worksheet: string
}
const PerformanceHub = (props: TabViewProps) =>{
    const{
        tsURL,
        worksheet
    } = props
    const ref = useRef<any>(null);
    const searchRef = useRef<any>(null);
    const embedRef = useEmbedRef<typeof LiveboardEmbed>();
    const searchEmbedRef = useEmbedRef<typeof SearchEmbed>();
    const [selectedTab, setSelectedTab] = useState(SelectedTab.ALL)
    const [categoryFilterValue, setCategoryFilterValue] = useState([])
    const [categoryTSFilter, setCategoryTSFilter] = useState({})
    const [TSRestFilter, setTSSRestFilter] = useState<RESTFilter>({
        col1: 'Department',
        op1: 'IN',
        col2: 'Brand',
        op2: 'IN',
    })
    const [categoryFilterOptions, setCategoryFilterOptions] = useState<any[]>([])
    const [brandFilterValue, setBrandFilterValue] = useState([])
    const [brandTSFilter, setBrandTSFilter] = useState({})
    const [brandFilterOptions, setBrandFilterOptions] = useState<any[]>([])

    const [selectedRole, setSelectedRole] = useState(SelectedRole.ADMIN);
    const [showRoleSelector, setShowRoleSelector] = useState(false);
    const [myLiveboardId, setMyLiveboardId] = useState<string | null>(null)
    
    const [showNameEdit, setShowNameEdit] = useState(false);
    const [showNewViz, setShowNewViz] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(()=>{
        var url = tsURL+"/api/rest/2.0/metadata/answer/data"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
            body: JSON.stringify({
                "metadata_identifier": "03f027d7-12a0-47b5-9ae4-7529a116f1a3",
                "record_offset": 0,
                "record_size": 80
            })
        })
        .then(response => response.json()).then(
            data => {
                let filterData = data.contents[0].data_rows;
                var categories: any[] = []
                var brands: any[] = []
                var categoryOptions: any[] = []
                var brandOptions: any[] = []
                for (var dataRow of filterData){
                    let category = {'value':dataRow[0],'label':dataRow[0]}
                    if (!categories.includes(dataRow[0])){
                        categoryOptions.push(category);
                        categories.push(dataRow[0])
                    }
                    let brand = {'value':dataRow[1],'label':dataRow[1]}
                    if (!brands.includes(dataRow[1])){
                        brandOptions.push(brand);
                        brands.push(dataRow[1]);
                    }
                }
                setCategoryFilterOptions(categoryOptions);
                setBrandFilterOptions(brandOptions);
        })

    },[])
    useEffect(()=>{
        if (showNewViz){
            ref.current.style.display = 'none'
            searchRef.current.style.display = 'flex'
            //searchEmbedRef.current.trigger(HostEvent.ResetSearch)
        }else{
            ref.current.style.display = 'flex'
            searchRef.current.style.display = 'none'     
        }
    },[showNewViz])
    useEffect(()=>{
        if (myLiveboardId){
            ref.current.style.display = 'flex'
            searchRef.current.style.display = 'none';
            embedRef.current.navigateToLiveboard(myLiveboardId);
        }else{
            ref.current.style.display = 'none'
        }
    }, [myLiveboardId])
    useEffect(()=>{
        if (!embedRef.current || !ref.current) return
        searchRef.current.style.display = 'none'
        if (selectedTab == SelectedTab.ALL || (selectedTab == SelectedTab.MY && myLiveboardId == null)){
            ref.current.style.display = 'none'
        }else{
            ref.current.style.display = 'flex'
        }
        let liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0"  
        switch (selectedTab){
            case (SelectedTab.SALES):
                liveboardId = "a2fee3fb-c67a-4cdc-bdb9-b2dac0e6ec3b";
                break;
            case (SelectedTab.CATEGORY):
                liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0";
                break;
            case (SelectedTab.CUSTOMER):
                liveboardId = "1b191748-0c6b-496c-9ef3-ebf4dee1514d";
                break;
            case (SelectedTab.STORE):
                liveboardId = "46d8822c-2674-438c-b540-d08eddfe263b";
                break;
        }
        if (selectedTab == SelectedTab.MY && myLiveboardId){
            liveboardId = myLiveboardId;
        }
        
        //@ts-ignore
        embedRef.current.navigateToLiveboard(liveboardId);
    },[selectedTab])

    useEffect(()=>{
        if (!embedRef.current)
        //@ts-ignore
        embedRef.current.prerenderGeneric();
    },[embedRef])

    function TriggerNewLiveboard(name: string, description: string){
        searchRef.current.style.display = 'none';
        let liveboard: executeTMLInput = {
            create_new: true,
            metadata_tmls: ['liveboard:\n  name: '+name+'\n  description: '+description]
        }
        executeTML(liveboard).then((data)=>{
            let newId = data[0].response.header.id_guid;
            setMyLiveboardId(newId);
            setShowNameEdit(false);
            setIsEditing(false)
        });

    }

    function OnPin(){
        if (myLiveboardId){
            //embedRef.current.prerenderGeneric();
            embedRef.current.trigger(HostEvent.Reload)
            embedRef.current.navigateToLiveboard(myLiveboardId)
            setShowNewViz(false) 
        }
    
    }
    function PinViz(){

        // answerService.executeQuery(
        //     'mutation addVizToPinboardWithSession($session: BachSessionIdInput!, $vizId: GUID!, $newVizName: String, $newVizDescription: String, $pinboardId: GUID, $newPinboardName: String, $tabId: GUID, $newTabName: String, $pinFromStore: Boolean) {\n  Answer__addVizToPinboard(\n    session: $session\n    vizId: $vizId\n    newVizName: $newVizName\n    newVizDescription: $newVizDescription\n    pinboardId: $pinboardId\n    newPinboardName: $newPinboardName\n    tabId: $tabId\n    newTabName: $newTabName\n    pinFromStore: $pinFromStore\n  ) {\n    pinboardId\n    tabId\n    vizId\n    __typename\n  }\n}\n"}',
        //     { vizId: embedAsnwerData, pinboardId: myLiveboardId },
        // );
        // searchEmbedRef.current.trigger(HostEvent.Pin, {
        //     liveboardId: myLiveboardId
        // })
        embedRef.current.trigger(HostEvent.UpdateFilters)
        setShowNewViz(false)
    }
    function updateAnswerService(e: any){
        console.log("here",e)
        const { session, embedAnswerData, contextMenuPoints } = e.data as CustomActionPayload;
        const answerService = new AnswerService(
            session,
            embedAnswerData,
            tsURL,
            contextMenuPoints?.selectedPoints,
        );
        answerService.executeQuery(
            'mutation addVizToPinboardWithSession($session: BachSessionIdInput!, $vizId: GUID!, $newVizName: String, $newVizDescription: String, $pinboardId: GUID, $newPinboardName: String, $tabId: GUID, $newTabName: String, $pinFromStore: Boolean) {\n  Answer__addVizToPinboard(\n    session: $session\n    vizId: $vizId\n    newVizName: $newVizName\n    newVizDescription: $newVizDescription\n    pinboardId: $pinboardId\n    newPinboardName: $newPinboardName\n    tabId: $tabId\n    newTabName: $newTabName\n    pinFromStore: $pinFromStore\n  ) {\n    pinboardId\n    tabId\n    vizId\n    __typename\n  }\n}\n',
            { vizId: embedAnswerData.id, 
                pinboardId: myLiveboardId, 
                newVizName: embedAnswerData.name, 
                newVizDescription: embedAnswerData.description,
                tabId: null },
        );
        searchEmbedRef.current.trigger(HostEvent.Pin, {
            liveboardId: myLiveboardId
        })
        embedRef.current.trigger(HostEvent.UpdateFilters)
        //setShowNewViz(false)
    }
    function LiveboardEdit(){
        if (isEditing){
            embedRef.current.trigger(HostEvent.Save)
            setIsEditing(false)
        }else{
            console.log("here!!!")
            embedRef.current.trigger(HostEvent.Edit,{verificationStatus:true})
            setIsEditing(true)
        }
    }
    function ToggleCategoryFilter(e: any){
        console.log("category", e)
        var filterVals = []
        for (var i=0;i<e.length;i++){
          filterVals.push(e[i].label)
        }
        var filtersObj  = {
          columnName: 'Department',
          operator: RuntimeFilterOp.IN,
          values: filterVals
        }
        var restFiltersObj = TSRestFilter;
        if (filterVals.length == 0){
            delete restFiltersObj['val1']
        }else{
            restFiltersObj.val1= filterVals
        }
        setCategoryFilterValue(e)
        setCategoryTSFilter(filtersObj)
        setTSSRestFilter(restFiltersObj);
        if (JSON.stringify(brandTSFilter) != "{}"){
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[filtersObj,brandTSFilter])
        }else{
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[filtersObj])
        }
    }
    function ToggleBrandFilter(e: any){
        var filterVals = []
        for (var i=0;i<e.length;i++){
          filterVals.push(e[i].label)
        }
        var filtersObj  = {
          columnName: 'Brand',
          operator: RuntimeFilterOp.IN,
          values: filterVals
        }
        var restFiltersObj = TSRestFilter;
        if (filterVals.length == 0){
            delete restFiltersObj['val2']
        }else{
            restFiltersObj.val2 = filterVals
        }
        setBrandFilterValue(e)
        setBrandTSFilter(filtersObj)
        setTSSRestFilter(restFiltersObj);
        if (JSON.stringify(categoryTSFilter) != "{}"){
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[categoryTSFilter,filtersObj])
        }else{
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[filtersObj])
        }

    }
    const HeaderLinks = [
        { name: SelectedTab.ALL, icon: <FiHome/>, onClick:()=>setSelectedTab(SelectedTab.ALL),isSelected:selectedTab==SelectedTab.ALL ,subMenu:false},
    ]
    const LinkItems = [
        { name: SelectedTab.SALES, icon: <FiTrendingUp/>, onClick:()=>setSelectedTab(SelectedTab.SALES),isSelected:selectedTab==SelectedTab.SALES, subMenu:true},
        { name: SelectedTab.CUSTOMER, icon: <FiCompass/>, onClick:()=>setSelectedTab(SelectedTab.CUSTOMER),isSelected:selectedTab==SelectedTab.CUSTOMER, subMenu:true},
        { name: SelectedTab.STORE, icon: <FiStar/>, onClick:()=>setSelectedTab(SelectedTab.STORE),isSelected:selectedTab==SelectedTab.STORE, subMenu:true},
        { name: SelectedTab.CATEGORY, icon: <FiSettings/>, onClick:()=>setSelectedTab(SelectedTab.CATEGORY),isSelected:selectedTab==SelectedTab.CATEGORY, subMenu:true },
      ];

    const OtherLinks = [
        { name: SelectedTab.MY, icon: <FiHome/>, onClick:()=>setSelectedTab(SelectedTab.MY),isSelected:selectedTab==SelectedTab.MY ,subMenu:false},
    ]
      var overrideStrings = {
        "allItemsAreSelected": "All Categories",
        "search": "Search Categories",
        "selectAll": "All Categories",
        "selectAllFiltered": "Select All (Filtered)",
        "selectSomeItems": "Select A Category",
        "create": "Create",
    }   
    var brandOverrideStrings = {
        "allItemsAreSelected": "All Brands",
        "search": "Search Brands",
        "selectAll": "All Brands",
        "selectAllFiltered": "Select All (Filtered)",
        "selectSomeItems": "Select A Brand",
        "create": "Create",
    } 
    return(
        <div style={{display:'flex',flexDirection:'row',background:'#f6f8fa',width:'100%',height:'100%',padding:'10px'}}>
            <div className='flex flex-col p-3' style={{width:"220px", background:'#ffffff',paddingTop:'25px'}}>
                
                {/* <div onClick={()=>setShowRoleSelector(!showRoleSelector)} style={{width:'100%',height:'50px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <div style={{border:'1px solid #343434', borderRadius:'50px',width:'50%',display:'flex',alignItems:'center',height:'40px',justifyContent:'center'}}>
                    <Icon
                        fontSize="32"
                        as={FiUsers}
                    />
                </div>
                </div> */}
                {showRoleSelector && 
                    <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole}></RoleSelector>
                }
                {HeaderLinks.map((link) => (
                    <SideNavLink icon={link.icon} linkName={link.name} onClick={link.onClick} isSelected={link.isSelected}></SideNavLink>
                ))}
                <div className="border-b-2 border-slate-50 m-2"></div>
                {LinkItems.map((link) => (
                    <SideNavLink icon={link.icon} linkName={link.name} onClick={link.onClick} isSelected={link.isSelected}></SideNavLink>
                ))}
                <div className="border-b-2 border-slate-50 m-2"></div>
                {OtherLinks.map((link) => (
                    <SideNavLink icon={link.icon} linkName={link.name} onClick={link.onClick} isSelected={link.isSelected}></SideNavLink>
                ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',width:"calc(100% - 220px)",overflow:'auto',scrollbarWidth:'thin'}}>
            
            
            <div className="p-2 h-36 ml-5" style={{marginBottom: selectedTab ==SelectedTab.ALL ? 15 : 30}}>
                <div className="flex text-2xl font-bold mb-4">{selectedTab}</div>
                

                <div style={{display:'flex',flexDirection:'row',height:'50px'}}>
                    <div style={{display:'flex',flexDirection:'column',height:'80px',width:'300px'}}>
                        <MultiSelect 
                            labelledBy={''}
                            hasSelectAll={true} 
                            value={categoryFilterValue} 
                            options={categoryFilterOptions} 
                            onChange={ToggleCategoryFilter}
                            overrideStrings={overrideStrings}/>
                    </div>
                    <div className='mr-4' style={{marginLeft:10,display:'flex',flexDirection:'column',height:'80px',width:'300px'}}>
                        <MultiSelect 
                            labelledBy={''}
                            hasSelectAll={true} 
                            value={brandFilterValue} 
                            options={brandFilterOptions} 
                            onChange={ToggleBrandFilter}
                            overrideStrings={brandOverrideStrings}/>
                    </div>
                    {(selectedTab == SelectedTab.MY && !myLiveboardId) && (
                        <div onClick={() => setShowNameEdit(true)} className='flex w-44 hover:cursor-pointer hover:bg-green-100 items-center justify-center rounded-lg bg-green-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                            Create New
                        </div>
                    )}
                    {(selectedTab == SelectedTab.MY && myLiveboardId && !showNewViz)  && (
                        <div onClick={() => setShowNewViz(true)} className='flex w-44 hover:cursor-pointer hover:bg-blue-100 items-center justify-center rounded-lg bg-blue-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                            Add A Viz
                        </div>
                    )}
                    {(selectedTab == SelectedTab.MY && myLiveboardId && !showNewViz)  && (
                        <div onClick={() => LiveboardEdit()} className='flex w-44 ml-4 hover:cursor-pointer hover:bg-blue-100 items-center justify-center rounded-lg bg-blue-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                            {isEditing ? 'Confirm' : 'Adjust Layout' }
                        </div>
                    )}
                    {(selectedTab == SelectedTab.MY && myLiveboardId && showNewViz)  && (
                        <div onClick={() => PinViz()} className='flex w-44 hover:cursor-pointer hover:bg-green-100 items-center justify-center rounded-lg bg-green-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                            Confirm
                        </div>
                    )}
                    {(selectedTab == SelectedTab.MY && myLiveboardId && showNewViz)  && (
                        <div onClick={() => setShowNewViz(false)} className='flex w-44 hover:cursor-pointer hover:bg-grey-100 items-center justify-center rounded-lg bg-grey-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                            Cancel
                        </div>
                    )}
                </div>

                {/* <Input borderRadius={20} width={350} borderColor="blue" backgroundColor={'#ffffff'}></Input> */}
            </div>


            {selectedTab==SelectedTab.ALL && (
            <div className='p-2'></div>
            )}
            <div className="flex flex-col pl-6 pr-6 space-y-4">
            
                {(selectedTab == SelectedTab.SALES || selectedTab == SelectedTab.ALL) && 
                    <Tab isSelected={selectedTab==SelectedTab.SALES} tab={SelectedTab.SALES} setSelectedTab={setSelectedTab} image={salesImage}>                    
                        <SalesTab key={"1"+JSON.stringify(TSRestFilter)} tsURL={tsURL} TSRestFilter={TSRestFilter}></SalesTab>
                    </Tab>
                }
                {(selectedTab == SelectedTab.CUSTOMER || selectedTab == SelectedTab.ALL)  && 
                    <Tab isSelected={selectedTab==SelectedTab.CUSTOMER} tab={SelectedTab.CUSTOMER} setSelectedTab={setSelectedTab} image={customersImage}>                    
                        <CustomerTab key={"3"+JSON.stringify(TSRestFilter)} tsURL={tsURL} TSRestFilter={TSRestFilter}></CustomerTab>
                    </Tab>
                }
                {(selectedTab == SelectedTab.STORE || selectedTab == SelectedTab.ALL)  && 
                    <Tab isSelected={selectedTab==SelectedTab.STORE} tab={SelectedTab.STORE} setSelectedTab={setSelectedTab} image={storeImage}>
                        <StoreTab key={"2"+JSON.stringify(TSRestFilter)} tsURL={tsURL} TSRestFilter={TSRestFilter}></StoreTab>
                    </Tab>
                }
                {(selectedTab == SelectedTab.CATEGORY || selectedTab == SelectedTab.ALL)  && 
                    <Tab isSelected={selectedTab==SelectedTab.CATEGORY} tab={SelectedTab.CATEGORY} setSelectedTab={setSelectedTab} image={categoriesImage}>
                        <CategoryTab key={"4"+JSON.stringify(TSRestFilter)} tsURL={tsURL} TSRestFilter={TSRestFilter}></CategoryTab>
                    </Tab>
                }
            </div>
            {showNameEdit && 
                <LiveboardNameInput triggerNewLiveboard={TriggerNewLiveboard}></LiveboardNameInput>
            }
            {(selectedTab == SelectedTab.MY && !showNameEdit) && (
                <BrowsePage tsURL={tsURL} setMyLiveboardId={setMyLiveboardId} myLiveboardId={myLiveboardId}></BrowsePage>
            )}
            {//visibleActions={[Action.AnswerChartSwitcher,Action.Pin,Action.]}
            }
            <div style={{display:'none',height:'100%',width:'100%'}} ref={searchRef}>
                <SearchEmbed
                    ref={searchEmbedRef}
                    onPin={OnPin}
                    frameParams={{width:'100%',height:'100%'}}
                    dataSource={worksheet}
                    onCustomAction={(e)=>updateAnswerService(e)}
                    customizations= {
                        {
                        style: {
                        customCSS: {
                            variables: {
                            "--ts-var-root-background": "#f6f8fa",
                            "--ts-var-viz-border-radius": "25px",
                            "--ts-var-viz-box-shadow":"0px"
                            },
                            rules_UNSTABLE: {
                                '[data-testid="pinboard-header"]': {
                                    'display': 'none !important'
                                },
                                '.ReactModalPortal .ReactModal__Overlay':{
                                    'background-color': '#ffffff00 !important'
                                },
                                '.answer-module__searchCurtain':{
                                    'background-color': '#ffffff00 !important'
                                }
                            }
                            
                        }
                        }
                    }
                    }
                ></SearchEmbed>
            </div>
            <div style={{display:'none',height:'100%',width:'100%'}} ref={ref}>
            <LiveboardEmbed 
                ref={embedRef} 
                customizations= {
                    {
                    style: {
                    customCSS: {
                        variables: {
                        "--ts-var-root-background": "#f6f8fa",
                        "--ts-var-viz-border-radius": "25px",
                        "--ts-var-viz-box-shadow":"0px"
                        },
                        rules_UNSTABLE: {
                            '[data-testid="pinboard-header"]': {
                                'display': 'none !important'
                            },
                            '.ReactModalPortal .ReactModal__Overlay':{
                                'background-color': '#ffffff00 !important'
                            }
                        }
                        
                    }
                    }
                }
                }
                liveboardId={"5fc750d7-dd94-4638-995c-31f0434ce2a0"}
                fullHeight={true}
                frameParams={{width:'100%',height:'100%'}}
                />
            </div>
            <div style={{height:'100px'}}></div>
               
            </div>

        </div>
    )
}
export default PerformanceHub;




  interface RoleSelectorProps{
    selectedRole: SelectedRole,
    setSelectedRole: (role: SelectedRole)=>void
  }
  function RoleSelector(props: RoleSelectorProps){
      const {
        selectedRole,
        setSelectedRole
      } = props
      return (
          
          <div style={{position:'absolute',width:'175px',display:'flex',flexDirection:'column',left:180,background:'#ffffff', borderRadius:'15px',zIndex:99,padding:'15px',gap: '10px'}}>
            <Role isSelected={selectedRole==SelectedRole.ADMIN} role={SelectedRole.ADMIN} setSelectedRole={setSelectedRole}></Role>
            <Role isSelected={selectedRole==SelectedRole.CAT} role={SelectedRole.CAT} setSelectedRole={setSelectedRole}></Role>
            <Role isSelected={selectedRole==SelectedRole.SALES} role={SelectedRole.SALES} setSelectedRole={setSelectedRole}></Role>
            <Role isSelected={selectedRole==SelectedRole.STORE} role={SelectedRole.STORE} setSelectedRole={setSelectedRole}></Role>
          </div>
      )
  }
  interface RoleProps{
      isSelected: boolean,
      role: SelectedRole,
      setSelectedRole: (role: SelectedRole) => void
  }
  function Role(props: RoleProps){
      const {
          isSelected,
          role,
          setSelectedRole
      } = props
      return (
        <div  style={{background:isSelected? '0000ef11' : 'none'}} onClick={()=>setSelectedRole(role)}>
            {role}
        </div>
      )
  }
interface SideNavLinkProps{
    icon: ReactElement,
    onClick: () => void,
    linkName: string,    
    isSelected: boolean
}
const SideNavLink = (props: SideNavLinkProps) => {
    const {
        icon,
        onClick,
        linkName,
        isSelected
    } = props
    return (
        <div className='flex  items-center p-1 cursor-pointer bg-white hover:bg-slate-100 rounded-md h-12' 
            style={{color:isSelected ? "blue" : "#232323"}}
            onClick={onClick} 
            key={linkName}>

            <div className='mr-2'>{icon}</div>
            {linkName}
        </div>
    )
}


interface LiveboardNameInputProps{
    triggerNewLiveboard: (name: string, desc: string) => void
}
const LiveboardNameInput = (props: LiveboardNameInputProps) => {
    const {
        triggerNewLiveboard
    } = props
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const handleLiveboardName = () =>{
        triggerNewLiveboard(name,description)
    }
    return (
        <div className='flex flex-col justify-center items-center h-full'>
            <input placeholder='Name' className='p-2 w-80 h-12 rounded-lg mb-8' value={name} onChange={(e)=>setName(e.target.value)} ></input>
            <textarea placeholder='Description' className='p-2 w-80 h-16 rounded-lg mb-8' value={description} onChange={(e)=>setDescription(e.target.value)} ></textarea>
            <div onClick={handleLiveboardName} className='flex w-44 hover:cursor-pointer hover:bg-green-100 items-center justify-center rounded-lg bg-green-200 font-bold' style={{height:'64px',marginTop:'2px'}}>
                Create
            </div>
        </div>
    )
}
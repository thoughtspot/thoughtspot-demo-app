import React, { useState, useEffect, useRef, ReactNode, ReactElement } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp} from '@thoughtspot/visual-embed-sdk';
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
    MY = "My Insights",
    NEW = "Create"
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
}
const Tabs = (props: TabViewProps) =>{
    const{
        tsURL,
    } = props
    const ref = useRef<any>(null);
    const embedRef = useEmbedRef<typeof LiveboardEmbed>();
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
 
    useEffect(()=>{
        var url = tsURL+"api/rest/2.0/metadata/answer/data"
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
        if (!embedRef.current || !ref.current) return
        if (selectedTab == SelectedTab.ALL){
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
        //@ts-ignore
        embedRef.current.navigateToLiveboard(liveboardId);
        console.log("here",selectedTab);
    },[selectedTab])

    useEffect(()=>{
        if (!embedRef.current)
        //@ts-ignore
        embedRef.current.prerenderGeneric();
    },[embedRef])


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
        { name: SelectedTab.NEW, icon: <FiHome/>, onClick:()=>setSelectedTab(SelectedTab.NEW),isSelected:selectedTab==SelectedTab.NEW ,subMenu:false},

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
                    <div style={{marginLeft:10,display:'flex',flexDirection:'column',height:'80px',width:'200px'}}>
                        <MultiSelect 
                            labelledBy={''}
                            hasSelectAll={true} 
                            value={brandFilterValue} 
                            options={brandFilterOptions} 
                            onChange={ToggleBrandFilter}
                            overrideStrings={brandOverrideStrings}/>
                    </div>
                </div>

                {/* <Input borderRadius={20} width={350} borderColor="blue" backgroundColor={'#ffffff'}></Input> */}
            </div>

            
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
export default Tabs;




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
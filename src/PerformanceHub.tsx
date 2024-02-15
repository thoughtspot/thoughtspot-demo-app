import { useState, ReactElement, useEffect } from 'react';
import {
    FiHome,
  } from 'react-icons/fi';
  import { IoBarChartSharp } from "react-icons/io5";
  import { IoSearch } from "react-icons/io5";
  import {
    LiveboardEmbed,
    SageEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
import './Tabs.css'
import { getTSObjectList } from './api';
import BrowsePage from './AllLiveboard';

export enum SelectedTab {
    MY = "My Liveboards",
    ALL = "All Liveboards",
    NLS = "Natural Language Search",
}

interface TabViewProps{
    tsURL: string,
}

const PerformanceHub = (props: TabViewProps) =>{
    const{
        tsURL,
    } = props
    const embedRef = useEmbedRef<typeof LiveboardEmbed>();
    const searchEmbedRef = useEmbedRef<typeof SageEmbed>();
    const [myLiveboardId, setMyLiveboardId] = useState<string | null>(null)
    const [selectedTab, setSelectedTab] = useState(SelectedTab.MY);
    const [liveboardList, setLiveboardList] = useState([] as any);

    useEffect(() => {
      const fetchLiveboardList = async () => {
        const lbList = await getTSObjectList(tsURL);
        setLiveboardList(lbList as any);
      }
    fetchLiveboardList();
    }, []);



    const OtherLinks = [
        { name: SelectedTab.MY, icon: <FiHome/>, onClick:()=>setSelectedTab(SelectedTab.MY),isSelected:selectedTab==SelectedTab.MY ,subMenu:false},
        { name: SelectedTab.ALL, icon:<IoBarChartSharp />, onClick: () => setSelectedTab(SelectedTab.ALL), isSelected: selectedTab === SelectedTab.ALL, subMenu: false},
        { name: SelectedTab.NLS, icon: <IoSearch />, onClick: () => setSelectedTab(SelectedTab.NLS), isSelected: selectedTab === SelectedTab.NLS, subMenu: false},
    ]

    return(
        <div style={{display:'flex',flexDirection:'row',background:'#f6f8fa',width:'100%',height:'100%',padding:'10px'}}>
            {/*This is side bar */}
            <div className='flex flex-col p-3' style={{width:"220px", background:'#ffffff',paddingTop:'25px'}}>
                <div className="border-b-2 border-slate-50 m-2"></div>
                {OtherLinks.map((link) => (
                    <SideNavLink icon={link.icon} linkName={link.name} onClick={link.onClick} isSelected={link.isSelected}></SideNavLink>
                ))}
            </div>
            <div style={{width: '100%', overflow: 'auto'}}>
            {selectedTab === SelectedTab.ALL && <BrowsePage liveboardList={liveboardList} setMyLiveboardId={setMyLiveboardId} myLiveboardId={myLiveboardId}></BrowsePage>}
            {(selectedTab === SelectedTab.MY ||(selectedTab === SelectedTab.ALL && myLiveboardId)) && <LiveboardEmbed 
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
                            },
                            '.banner-alert-module__container':{
                                'display' : 'none !important'
                            }
                        }
                        
                    }
                    }
                }
                }
                liveboardId={liveboardList?.[0]?.metadata_id || ''}
                fullHeight={true}
                frameParams={{width:'100%',height:'100%'}}
                />
            }
            {selectedTab === SelectedTab.NLS && <SageEmbed
                    ref={searchEmbedRef}
                    frameParams={{width:'100%',height:'100%'}}
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
                ></SageEmbed>}
                </div>
        </div>
    )
}
export default PerformanceHub;

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
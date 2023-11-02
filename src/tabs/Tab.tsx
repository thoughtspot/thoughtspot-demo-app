import React, {ReactNode} from 'react';
import { SelectedTab } from "../Tabs"

interface TabProps {
    children?: ReactNode,
    tab: SelectedTab,
    setSelectedTab: (tab: SelectedTab)=>void,
    isSelected: boolean,
    image: string
}

export const Tab = (props: TabProps) => {
    const {
        children,
        tab,
        setSelectedTab,
        isSelected,
        image
    } = props
    return (
    
        <div className="flex flex-row p-15 h-48 mb-25 bg-white rounded-3xl shadow-sm shadow-slate-100">
            <div style={{width:"calc(100% - 175px)"}} className="flex flex-col h-full">
                <div className="flex flex-row align-start pl-5 pt-5 w-full">
                    <div className="flex text-lg align-start font-bold ml-5 mr-5 w-2/4">
                        {tab}
                    </div>
                </div>
                {children}
            </div>
            <div className="flex flex-col items-center justify-center mb-5">
                <img  className='h-36' src={image} >
                </img>
                <div className='text-sm font-bold text-blue-400 hover:text-blue-200' onClick={()=>isSelected ? setSelectedTab(SelectedTab.ALL) : setSelectedTab(tab)}>
                    {isSelected ? 'VIEW ALL' : 'EXPLORE'}
                </div>           
            </div>
        </div>
    )
}
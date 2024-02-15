import { useState } from "react"
import { FiArrowLeft, FiX } from "react-icons/fi"

interface ContentProps {
    name: string,
    id: string,
    myLiveboardId: string | null,
    setMyLiveboardId: (id: string | null) => void
}

interface BrowseProps{
    liveboardList: any,
    myLiveboardId: string | null,
    setMyLiveboardId: (id: string | null) => void
}
export default function BrowsePage(props: BrowseProps){
    const {
        liveboardList,
        myLiveboardId,
        setMyLiveboardId,
    } = props

    console.log('checkk', myLiveboardId);

    return (
    <div className="flex flex-col p-5 space-y-1">
       {liveboardList.map((liveboard: any)=>(
           <>
           {(!myLiveboardId || myLiveboardId === liveboard.metadata_id) && (
           <ContentItem name={liveboard.metadata_name} id={liveboard.metadata_id} myLiveboardId={myLiveboardId} setMyLiveboardId={setMyLiveboardId}></ContentItem>
           )}
           </>
       ))}
    </div>
    )
}

function ContentItem(props: ContentProps){
    const {
        name,
        id,
        myLiveboardId,
        setMyLiveboardId
    } = props
    return (
        <div className='hover:cursor-pointer' style={{display:"flex",flexDirection:"row",padding:15,maxHeight:250,marginBottom:25,background:"#ffffff",borderRadius:"25px",boxShadow:"0 0 15 #efefef"}}>
            <div className="flex  justify-start flex-col w-3/4 pl-4" onClick={()=>setMyLiveboardId(id)} > 
                <div className="flex font-bold text-lg">
                    {name}
                </div>
            </div>
            <div onClick={()=>setMyLiveboardId(null)} className="flex w-1/4 justify-end items-center text-blue-400 hover:text-blue-200">
                {id == myLiveboardId && (
                    <div className="flex flex-row space-x-4 mr-2 items-center">
                        <FiArrowLeft></FiArrowLeft>
                        Back to Browse
                    </div>
                )}
            </div>
            
        </div>       
    )
}
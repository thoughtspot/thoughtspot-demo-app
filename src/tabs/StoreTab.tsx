import React, { useState, useEffect } from "react"
import { currencyFormatter } from "../util/Util"
//@ts-ignore
import storeImage from './images/store.png'
import { SelectedTab } from "../Tabs"
export default function StoreTab(props: {tsURL: string; TSRestFilter: any }){
    const {
        tsURL,
        TSRestFilter
    } = props
    const [data,setData] = useState('')
    useEffect(() => {
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
                "metadata_identifier": "00ca1c7e-1293-46fe-a8e2-0cc33ce7cccc",
                "record_offset": 0,
                "record_size": 10,
                "runtime_filter":TSRestFilter
            })
        })
        .then(response => response.json()).then(
            data => {
                setData(data.contents[0].data_rows)
        })
    },[TSRestFilter])
    return (
        <>
        <div className="flex flex-col h-24 align-start justify-center pl-10">
            <div className="flex text-3xl font-bold pt-5">
                {data ? Number(data[0][0]) : null}
            </div>
            <div className="flex">
            Locations
            </div>
        </div>
        <div className="flex flex-row pl-8">
            <div className="flex flex-row mr-2 pt-3 align-center">
                <div className="w-0.5 rounded-md"></div>
                <div className="pl-1 font-bold text-lg">
                    {data ? currencyFormatter.format(Number(data[0][1])) : null}
                </div>
                <div className="pl-1 text-lg">
                    Average Sales
                </div>
            </div>
            <div className="flex flex-row mr-2 pt-3 align-center">
                <div className="flex align-center">
                    <div className="rounded-md w-0.5"></div>
                    <div className="pl-1 font-bold text-lg">
                        {data ? currencyFormatter.format(Number(data[0][1])) : null}
                    </div>
                    <div className="pl-1 text-lg">
                        Top Store Sales
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

import React, { useState, useEffect } from "react"
import { currencyFormatter } from "../util/Util"
//@ts-ignore
import salesImage from './images/sales.png'
import { SelectedTab } from "../Tabs"

export default function SalesTab(props: { tsURL: string; TSRestFilter: any }){
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
                "metadata_identifier": "34808ec3-1272-4723-8339-fab426c9772a",
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
    console.log("sales data",data)

    let variance: number = 0;
    if(data) variance = Math.round(Number(data[0][0]) * 10000)/10;
    return (
        <>
            <div className="flex flex-col h-24 align-start justify-center pl-10">
                <div className="flex text-3xl font-bold pt-5">
                    {data ? currencyFormatter.format(Number(data[0][1])) : null}

                </div>
                <div className="flex">
                This Week
                </div>
            </div>
            <div className="flex flex-row pl-8">
                <div className="flex flex-row mr-2 pt-3 align-center">
                    <div className="w-0 rounded-md"></div>
                    <div className="pl-1 font-bold text-lg">
                        {data ? currencyFormatter.format(Number(data[0][1])) : null}
                    </div>
                    <div className="pl-1 text-lg">
                        Last Week
                    </div>
                </div>
                <div className="flex flex-row mr-2 pt-3 align-center">
                    <div className="flex align-center">
                        <div className="rounded-md w-0.5"></div>
                        <div className="pl-1 font-bold text-lg">
                            {data ? Math.round(Number(data[0][0])*100)/100 + "%" : null}
                        </div>
                        <div className="pl-1 text-lg">
                            Week over Week
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
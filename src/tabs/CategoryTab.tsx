import React, { useState, useEffect } from "react"
import { currencyFormatter } from "../util/Util"
//@ts-ignore
import catgoryImage from './images/categories.png'
import { SelectedTab } from "../Tabs"

export default function CategoryTab(props: {tsURL: string; TSRestFilter: any }){
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
                "metadata_identifier": "3a8cd271-8082-4c9a-a4a0-38741ab8f5bc",
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
            <div className="flex" >
            Products
            </div>
        </div>
        <div className="flex flex-row pl-8">
            <div className="flex flex-row mr-2 pt-3 align-center">
                <div className="w-0.5 rounded-md"></div>
                <div className="pl-1 font-bold text-lg">
                    {data ? Number(data[0][2]) : null}
                </div>
                <div className="pl-1 text-lg">
                   Brands
                </div>
            </div>
            <div className="flex flex-row mr-2 pt-3 align-center">
                <div className="flex align-center">
                    <div className="rounded-md w-0.5"></div>
                    <div className="pl-1 font-bold text-lg">
                        {data ? Number(data[0][1]) : null}
                    </div>
                    <div className="pl-1 text-lg">
                        Categories
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { All } from './All'
import { InProgress } from './InProgress'
import { set } from 'mongoose'


export function VisaStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "inprogress";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

    return (
        <div className='flex flex-col min-h-screen py-4 lg:pl-12 lg:py-8'>
        <h1 className='text-xl lg:text-[40px] text-left font-semibold mb-6'>Visa Status Management</h1>
        <Tabs 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full">
        <TabsList className="mb-4 w-1/3">
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="inprogress">
          <InProgress />
        </TabsContent>

        <TabsContent value="all">
          <All />
        </TabsContent>
      </Tabs>
        </div>
    )
}

import React from 'react'
import MainComponent from '@/components/script-analyse/mainComponent'

interface ScriptAnalysePageProps {
  params: { id: string }
}

const ScriptAnalysePage = ({ params }: ScriptAnalysePageProps) => {
  return (
    <div>
      <MainComponent id={params.id} />
    </div>
  )
}

export default ScriptAnalysePage 
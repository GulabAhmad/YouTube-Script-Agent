import React from 'react'
import MainComponent from '@/components/script-analyse/mainComponent'
import { BASE_URL } from '@/lib/utils';

interface ScriptAnalysePageProps {
  params: { id: string }
}

async function getScriptData(id: string) {
  const res = await fetch(`${BASE_URL}/scripts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch script data');
  return res.json();
}

const ScriptAnalysePage = async ({ params }: ScriptAnalysePageProps) => {
  const scriptData = await getScriptData(params.id);
  // const scriptData = null;
  return (
    <div>
      <MainComponent id={params.id} scriptData={scriptData} />
    </div>
  )
}

export default ScriptAnalysePage 
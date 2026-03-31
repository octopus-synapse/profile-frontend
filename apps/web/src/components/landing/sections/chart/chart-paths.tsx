interface ChartPathsProps {
  devsAreaPath: string;
  jobsAreaPath: string;
  devsPath: string;
  jobsPath: string;
}

export function ChartPaths({ devsAreaPath, jobsAreaPath, devsPath, jobsPath }: ChartPathsProps) {
  return (
    <>
      <path d={devsAreaPath} fill="url(#devsGradient)" />
      <path d={jobsAreaPath} fill="url(#jobsGradient)" />
      <path
        d={devsPath}
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <path
        d={jobsPath}
        fill="none"
        stroke="#06b6d4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </>
  );
}

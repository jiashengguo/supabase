import { useParams } from '@common'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'

export const LoadingState = () => {
  const { ref } = useParams()

  const projectName = 'Welcome to your project'

  return (
    <div className="w-full mx-auto">
      <div className="px-8 border-b">
        <div className="max-w-7xl mx-auto flex items-center space-x-6 h-[184px]">
          <h1 className="text-3xl">{projectName}</h1>
        </div>
      </div>
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <ProjectUsageLoadingState />
        </div>
      </div>
      <div className="px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <ShimmeringLoader className="w-40 h-7" />
          <ShimmeringLoader className="w-full h-32" />
        </div>
      </div>
    </div>
  )
}

export const ProjectUsageLoadingState = () => {
  return (
    <div className="space-y-6">
      <ShimmeringLoader className="w-40 h-7" />
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <ShimmeringLoader className="w-full h-[320px] py-0" />
        <ShimmeringLoader className="w-full h-[320px] py-0" />
        <ShimmeringLoader className="w-full h-[320px] py-0" />
        <ShimmeringLoader className="w-full h-[320px] py-0" />
      </div>
    </div>
  )
}

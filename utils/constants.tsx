import { ColorRing } from 'react-loader-spinner'

 // Reusable Loader Component
 export const Loader = () => (
  <div className="flex justify-center items-center">
    loading..
  <ColorRing
    visible={true}
    height="50"
    width="50"
    ariaLabel="color-ring-loading"
    wrapperStyle={{}}
    wrapperClass="color-ring-wrapper"
    colors={['#000000', '#808080', '#000000', '#808080', '#000000']} // Alternating black and gray
  />
</div>

);


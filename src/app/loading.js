// import loaderStyle from "./loading.module.css";
// export default function Loading() {
//   return (
//     <div className={loaderStyle.loadingMain}>
//       <div className={loaderStyle.glitchWrapper}>
//         <div className={loaderStyle.glitch} data-glitch="SmartDisperse">
//           SmartDisperse....
//         </div>
//       </div>
//     </div>
//   );
// }
// // 


import loaderStyle from "./loading.module.css";
export default function Loading() {
  return (
    <div className={loaderStyle.loadingMain}>
      
      <span className={loaderStyle.loader}>SmartDisperse...</span>

      
    </div>
  );
}
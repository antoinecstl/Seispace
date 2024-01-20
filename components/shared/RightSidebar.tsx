
async function RightSidebar() {
  
  return (
    <section className='bg-gray-950'>
      <div className='custom-scrollbar rightsidebar'>
        <div className='flex flex-1 flex-col justify-start'>
          <h3 className='text-heading4-medium text-light-1'>
            Players
          </h3>

          <div className='mt-7 flex flex-col gap-9'>
    
              <p className='!text-base-regular text-light-3'>
                No players for now
              </p>
      
          </div>
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
